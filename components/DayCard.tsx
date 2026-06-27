"use client";

import { useState } from "react";
import { Day, Location } from "@/lib/types";

interface DayCardProps {
  day: Day;
  dayIndex: number;
}

const typeConfig: Record<string, { icon: string; color: string; label: string }> = {
  attraction: { icon: "🏛️", color: "bg-purple-100 text-purple-700", label: "Atrakcija" },
  restaurant: { icon: "🍽️", color: "bg-orange-100 text-orange-700", label: "Restoranas" },
  hotel: { icon: "🏨", color: "bg-blue-100 text-blue-700", label: "Viešbutis" },
  activity: { icon: "🎯", color: "bg-green-100 text-green-700", label: "Veikla" },
};

const dayColors = [
  "from-blue-500 to-blue-600",
  "from-purple-500 to-purple-600",
  "from-green-500 to-green-600",
  "from-orange-500 to-orange-600",
  "from-red-500 to-red-600",
  "from-teal-500 to-teal-600",
  "from-indigo-500 to-indigo-600",
  "from-pink-500 to-pink-600",
];

function mapsUrl(loc: Location) {
  return `https://www.google.com/maps/search/?api=1&query=${loc.lat},${loc.lng}`;
}

function directionsUrl(from: Location, to: Location) {
  return `https://www.google.com/maps/dir/${from.lat},${from.lng}/${to.lat},${to.lng}`;
}

export default function DayCard({ day, dayIndex }: DayCardProps) {
  const [copied, setCopied] = useState(false);
  const [expanded, setExpanded] = useState(true);
  const [expandedLoc, setExpandedLoc] = useState<number | null>(null);
  const gradient = dayColors[dayIndex % dayColors.length];

  const copyDay = async () => {
    const text = day.locations
      .map((l, i) => {
        const prev = i > 0 ? day.locations[i - 1] : null;
        const dist = l.distance_from_prev_km && l.distance_from_prev_km > 0
          ? `\n  → ${l.travel_time_from_prev} (${l.distance_from_prev_km} km)` : "";
        return `${i + 1}. ${l.name}${dist}\n   ${l.description}\n   ⏱ ${l.duration} | 💶 ${l.cost}\n   📍 maps.google.com/?q=${l.lat},${l.lng}`;
      })
      .join("\n\n");
    const full = `Diena ${day.day}: ${day.title}\n${"-".repeat(40)}\n${text}\n\n💡 ${day.tips}`;
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(full);
      } else {
        const el = document.createElement("textarea");
        el.value = full;
        el.style.cssText = "position:fixed;opacity:0";
        document.body.appendChild(el);
        el.select();
        document.execCommand("copy");
        document.body.removeChild(el);
      }
    } catch {}
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      {/* Day header */}
      <div className={`bg-gradient-to-r ${gradient} px-5 py-4`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-lg">{day.day}</span>
            </div>
            <div>
              <p className="text-white/70 text-xs font-medium uppercase tracking-wide">Diena</p>
              <h3 className="text-white font-bold text-lg leading-tight">{day.title}</h3>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {day.daily_distance_km && day.daily_distance_km > 0 && (
              <span className="bg-white/20 text-white text-xs px-2.5 py-1.5 rounded-lg font-medium">
                🗺 {day.daily_distance_km} km
              </span>
            )}
            <button
              onClick={copyDay}
              className="bg-white/20 active:bg-white/40 text-white px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 touch-manipulation min-h-[40px]"
            >
              {copied ? "✓" : "📋"}
            </button>
            <button
              onClick={() => setExpanded(!expanded)}
              className="bg-white/20 active:bg-white/40 text-white w-10 h-10 rounded-lg flex items-center justify-center transition-colors touch-manipulation text-lg"
            >
              {expanded ? "−" : "+"}
            </button>
          </div>
        </div>
      </div>

      {expanded && (
        <div className="p-4">
          <div className="space-y-3">
            {day.locations.map((loc, i) => {
              const cfg = typeConfig[loc.type] ?? { icon: "📍", color: "bg-gray-100 text-gray-700", label: loc.type };
              const prev = i > 0 ? day.locations[i - 1] : null;
              const isExpanded = expandedLoc === i;
              const hasDistance = loc.distance_from_prev_km && loc.distance_from_prev_km > 0;

              return (
                <div key={i}>
                  {/* Travel connector */}
                  {hasDistance && prev && (
                    <div className="flex items-center gap-2 py-1.5 px-3">
                      <div className="w-0.5 h-full bg-gray-200 mx-2" />
                      <a
                        href={directionsUrl(prev, loc)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-xs text-blue-600 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-full transition-colors"
                      >
                        <span>🧭</span>
                        <span>{loc.travel_time_from_prev}</span>
                        <span className="text-blue-400">({loc.distance_from_prev_km} km)</span>
                        <span className="font-medium">Nukreipti →</span>
                      </a>
                    </div>
                  )}

                  {/* Location card */}
                  <div className="bg-gray-50 rounded-xl border border-gray-100 overflow-hidden">
                    <button
                      onClick={() => setExpandedLoc(isExpanded ? null : i)}
                      className="w-full text-left p-4 touch-manipulation"
                    >
                      <div className="flex gap-3">
                        <div className="text-2xl flex-shrink-0">{cfg.icon}</div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2 flex-wrap">
                            <h4 className="font-semibold text-gray-900">{loc.name}</h4>
                            <span className={`text-xs font-medium px-2 py-0.5 rounded-full flex-shrink-0 ${cfg.color}`}>
                              {cfg.label}
                            </span>
                          </div>
                          <p className="text-gray-500 text-sm mt-1 leading-relaxed line-clamp-2">{loc.description}</p>
                          <div className="flex flex-wrap gap-3 mt-2">
                            <span className="text-xs text-gray-500 flex items-center gap-1">⏱ {loc.duration}</span>
                            <span className="text-xs text-gray-500 flex items-center gap-1">💶 {loc.cost}</span>
                            {loc.opening_hours && (
                              <span className="text-xs text-gray-500 flex items-center gap-1">🕐 {loc.opening_hours}</span>
                            )}
                          </div>
                        </div>
                        <span className="text-gray-400 text-sm self-center">{isExpanded ? "▲" : "▼"}</span>
                      </div>
                    </button>

                    {/* Expanded details */}
                    {isExpanded && (
                      <div className="px-4 pb-4 border-t border-gray-100 pt-3 space-y-3">
                        <p className="text-gray-600 text-sm leading-relaxed">{loc.description}</p>

                        {loc.must_see && loc.must_see.length > 0 && (
                          <div>
                            <p className="text-xs font-semibold text-gray-700 uppercase tracking-wide mb-1.5">⭐ Būtinai pamatyk</p>
                            <ul className="space-y-1">
                              {loc.must_see.map((item, j) => (
                                <li key={j} className="text-sm text-gray-600 flex items-start gap-2">
                                  <span className="text-green-500 mt-0.5 flex-shrink-0">✓</span>
                                  {item}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {loc.booking_tip && (
                          <div className="bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">
                            <p className="text-xs text-amber-800">
                              <span className="font-semibold">🎟 Rezervacija: </span>
                              {loc.booking_tip}
                            </p>
                          </div>
                        )}

                        <div className="flex flex-wrap gap-2 pt-1">
                          <a
                            href={mapsUrl(loc)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white text-xs font-medium px-3 py-2 rounded-lg transition-colors touch-manipulation"
                          >
                            📍 Atidaryti Google Maps
                          </a>
                          {prev && (
                            <a
                              href={directionsUrl(prev, loc)}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-1.5 bg-green-600 hover:bg-green-700 active:bg-green-800 text-white text-xs font-medium px-3 py-2 rounded-lg transition-colors touch-manipulation"
                            >
                              🧭 Maršrutas iš ankstesnio
                            </a>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {day.tips && (
            <div className="mt-4 p-4 bg-amber-50 border border-amber-200 rounded-xl">
              <p className="text-amber-800 text-sm">
                <span className="font-semibold">💡 Dienos patarimas: </span>
                {day.tips}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
