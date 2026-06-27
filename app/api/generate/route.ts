import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { TripFormData } from "@/lib/types";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export async function POST(req: NextRequest) {
  try {
    const body: TripFormData = await req.json();
    const { destination, duration, style, budget, language } = body;

    if (!destination?.trim()) {
      return NextResponse.json({ error: "Destinacija privaloma" }, { status: 400 });
    }

    const prompt = `Esi kelionių ekspertas. Sukurk išsamų ${duration} dienų kelionės planą į ${destination}.
Kelionės stilius: ${style}. Biudžetas: ${budget}.
Atsakyk ${language} kalba.

Grąžink TIK galiojantį JSON be jokio papildomo teksto, komentarų ar markdown formatavimo. Tik JSON objektas:
{
  "title": "Kelionės pavadinimas",
  "summary": "Trumpas aprašymas",
  "budget_estimate": {
    "total_min": skaičius,
    "total_max": skaičius,
    "currency": "EUR",
    "breakdown": {
      "flights": "X-Y EUR",
      "accommodation": "X-Y EUR",
      "food": "X-Y EUR",
      "activities": "X-Y EUR",
      "transport": "X-Y EUR"
    }
  },
  "days": [
    {
      "day": 1,
      "title": "Dienos pavadinimas",
      "locations": [
        {
          "name": "Vietos pavadinimas",
          "lat": koordinatė,
          "lng": koordinatė,
          "description": "Aprašymas",
          "duration": "2 val",
          "cost": "10-20 EUR",
          "type": "attraction"
        }
      ],
      "tips": "Praktiniai patarimai šiai dienai"
    }
  ],
  "practical_info": {
    "best_time": "Geriausia kelionės data",
    "visa": "Vizos reikalavimai",
    "currency": "Vietinė valiuta",
    "language": "Vietinė kalba",
    "emergency": "Pagalbos numeris"
  }
}

Svarbu:
- Kiekviena diena turi turėti bent 3-5 vietas
- Vietos koordinatės turi būti tikslios (realios GPS koordinatės)
- type laukas turi būti vienas iš: attraction, restaurant, hotel, activity
- Grąžink tik JSON, be jokio papildomo teksto`;

    const message = await client.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 8192,
      messages: [{ role: "user", content: prompt }],
    });

    const content = message.content[0];
    if (content.type !== "text") {
      throw new Error("Netikėtas atsakymo tipas");
    }

    let json = content.text.trim();
    json = json.replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/i, "").trim();

    const plan = JSON.parse(json);
    return NextResponse.json(plan);
  } catch (err) {
    console.error("Generate error:", err);
    if (err instanceof SyntaxError) {
      return NextResponse.json({ error: "JSON parsavimo klaida iš Claude" }, { status: 500 });
    }
    const msg = err instanceof Error ? err.message : "Nežinoma klaida";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
