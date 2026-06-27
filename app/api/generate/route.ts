import { NextRequest, NextResponse } from "next/server";
import Groq from "groq-sdk";
import { TripFormData } from "@/lib/types";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function POST(req: NextRequest) {
  try {
    const body: TripFormData = await req.json();
    const { destination, duration, style, budget, language } = body;

    if (!destination?.trim()) {
      return NextResponse.json({ error: "Destinacija privaloma" }, { status: 400 });
    }

    const prompt = `You are an expert travel planner with deep local knowledge. Create a highly detailed and REALISTIC ${duration}-day trip plan to ${destination}.
Travel style: ${style}. Budget: ${budget}.
Respond in ${language} language.

Rules:
- All coordinates must be REAL and ACCURATE GPS coordinates
- Distances and travel times between locations must be REALISTIC
- Prices must reflect CURRENT real costs (not estimates)
- Must-see highlights should be specific insider tips, not generic
- Opening hours must be accurate for the destination
- Each day must have 4-6 locations in logical geographic order (minimize backtracking)
- The first location each day has no distance_from_prev_km (set to 0)
- budget totals must be realistic for the selected budget tier

Return ONLY valid JSON, no markdown, no extra text:
{
  "title": "Trip title",
  "summary": "Engaging 2-3 sentence summary",
  "budget_estimate": {
    "total_min": 0,
    "total_max": 0,
    "currency": "EUR",
    "per_person_per_day_min": 0,
    "per_person_per_day_max": 0,
    "breakdown": {
      "flights": "X-Y EUR round trip",
      "accommodation": "X-Y EUR per night",
      "food": "X-Y EUR per day",
      "activities": "X-Y EUR total",
      "transport": "X-Y EUR total"
    }
  },
  "days": [
    {
      "day": 1,
      "title": "Day title",
      "daily_distance_km": 12.5,
      "locations": [
        {
          "name": "Location name",
          "lat": 0.000000,
          "lng": 0.000000,
          "description": "Detailed 2-3 sentence description with specific details about what makes this place special",
          "duration": "2 hours",
          "cost": "10-20 EUR",
          "type": "attraction",
          "opening_hours": "09:00-18:00 (closed Mon)",
          "must_see": ["Specific highlight 1", "Specific highlight 2", "Insider tip"],
          "booking_tip": "Book online 2 days in advance to skip queues",
          "distance_from_prev_km": 0,
          "travel_time_from_prev": ""
        },
        {
          "name": "Second location",
          "lat": 0.000000,
          "lng": 0.000000,
          "description": "Detailed description",
          "duration": "1.5 hours",
          "cost": "Free",
          "type": "attraction",
          "opening_hours": "Open 24h",
          "must_see": ["Key highlight"],
          "booking_tip": "No booking needed",
          "distance_from_prev_km": 1.2,
          "travel_time_from_prev": "15 min walk"
        }
      ],
      "tips": "Practical day tips including best transport, what to wear, local customs"
    }
  ],
  "practical_info": {
    "best_time": "Best months and why",
    "visa": "Visa requirements for EU citizens",
    "currency": "Local currency and exchange tips",
    "language": "Local language and useful phrases",
    "emergency": "Emergency number and nearest hospital"
  }
}`;

    const completion = await groq.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "llama-3.3-70b-versatile",
      temperature: 0.6,
      max_tokens: 8192,
      response_format: { type: "json_object" },
    });

    const json = completion.choices[0]?.message?.content ?? "{}";
    return NextResponse.json(JSON.parse(json));
  } catch (err) {
    console.error("Generate error:", err);
    if (err instanceof SyntaxError) {
      return NextResponse.json({ error: "JSON parsavimo klaida" }, { status: 500 });
    }
    const msg = err instanceof Error ? err.message : "Nežinoma klaida";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
