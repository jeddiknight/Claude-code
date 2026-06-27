"use client";

import { useState } from "react";
import { Day } from "@/lib/types";

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

export default function DayCard({ day, dayIndex }: DayCardProps) {
  const [copied, setCopied] = useState(false);
  const [expanded, setExpanded] = useState(true);
  const gradient = dayColors[dayIndex % dayColors.length];

  const copyDay = async () => {
    const text = `${day.day} Diena: ${day.title}\n\n${day.locations
      .map(
        (l) =>
          `• ${l.name} (${l.type})\n  ${l.description}\n  Trukmė: ${l.duration} | Kaina: ${l.cost}`
      )
      .join("\n\n")}\n\nPatarimai: ${day.tips}`;
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(text);
      } else {
        const el = document.createElement("textarea");
        el.value = text;
        el.style.position = "fixed";
        el.style.opacity = "0";
        document.body.appendChild(el);
        el.focus();
        el.select();
        document.execCommand("copy");
        document.body.removeChild(el);
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <div className={`bg-gradient-to-r ${gradient} px-6 py-5`}>
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
            <button
              onClick={copyDay}
              className="bg-white/20 active:bg-white/40 text-white px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 touch-manipulation min-h-[40px]"
            >
              {copied ? "✓ Nukopijuota" : "📋 Kopijuoti"}
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
        <div className="p-6">
          <div className="space-y-4">
            {day.locations.map((loc, i) => {
              const cfg = typeConfig[loc.type] ?? { icon: "📍", color: "bg-gray-100 text-gray-700", label: loc.type };
              return (
                <div key={i} className="flex gap-4 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                  <div className="text-2xl flex-shrink-0 mt-0.5">{cfg.icon}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 flex-wrap">
                      <h4 className="font-semibold text-gray-900">{loc.name}</h4>
                      <span className={`text-xs font-medium px-2 py-0.5 rounded-full flex-shrink-0 ${cfg.color}`}>
                        {cfg.label}
                      </span>
                    </div>
                    <p className="text-gray-600 text-sm mt-1 leading-relaxed">{loc.description}</p>
                    <div className="flex flex-wrap gap-3 mt-2">
                      <span className="text-xs text-gray-500 flex items-center gap-1">
                        <span>⏱</span> {loc.duration}
                      </span>
                      <span className="text-xs text-gray-500 flex items-center gap-1">
                        <span>💶</span> {loc.cost}
                      </span>
                      <span className="text-xs text-gray-400 flex items-center gap-1">
                        <span>📍</span> {loc.lat.toFixed(4)}, {loc.lng.toFixed(4)}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {day.tips && (
            <div className="mt-4 p-4 bg-amber-50 border border-amber-200 rounded-xl">
              <p className="text-amber-800 text-sm">
                <span className="font-semibold">💡 Patarimas: </span>
                {day.tips}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
