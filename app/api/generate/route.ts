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

Grąžink TIK galiojantį JSON be jokio papildomo teksto:
{
  "title": "Kelionės pavadinimas",
  "summary": "Trumpas aprašymas",
  "budget_estimate": {
    "total_min": 0,
    "total_max": 0,
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
          "lat": 0.0,
          "lng": 0.0,
          "description": "Aprašymas",
          "duration": "2 val",
          "cost": "10-20 EUR",
          "type": "attraction"
        }
      ],
      "tips": "Patarimai"
    }
  ],
  "practical_info": {
    "best_time": "Geriausia data",
    "visa": "Vizos info",
    "currency": "Valiuta",
    "language": "Kalba",
    "emergency": "112"
  }
}

Svarbu: kiekviena diena 3-5 vietos, realios GPS koordinatės, type: attraction/restaurant/hotel/activity`;

    const message = await client.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 8192,
      messages: [{ role: "user", content: prompt }],
    });

    const content = message.content[0];
    if (content.type !== "text") throw new Error("Netikėtas atsakymo tipas");

    let json = content.text.trim();
    json = json.replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/i, "").trim();

    return NextResponse.json(JSON.parse(json));
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Klaida";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
