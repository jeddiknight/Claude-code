"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { TravelPlan } from "@/lib/types";
import DayCard from "@/components/DayCard";
import BudgetTable from "@/components/BudgetTable";
import { generateKML } from "@/lib/kml-generator";

export default function ResultsPage() {
  const [plan, setPlan] = useState<TravelPlan | null>(null);
  const [savedPlans, setSavedPlans] = useState<TravelPlan[]>([]);
  const [activeTab, setActiveTab] = useState<"itinerary" | "budget" | "info">("itinerary");

  useEffect(() => {
    const current = localStorage.getItem("currentPlan");
    if (current) setPlan(JSON.parse(current));
    const stored = localStorage.getItem("travelPlans");
    if (stored) setSavedPlans(JSON.parse(stored));
  }, []);

  const downloadKML = () => {
    if (!plan) return;
    const kml = generateKML(plan);
    const blob = new Blob([kml], { type: "application/vnd.google-earth.kml+xml" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${plan.title.replace(/[^a-z0-9]/gi, "_")}.kml`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const loadSavedPlan = (saved: TravelPlan) => {
    setPlan(saved);
    localStorage.setItem("currentPlan", JSON.stringify(saved));
    setActiveTab("itinerary");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (!plan) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="text-6xl mb-6">🗺️</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-3">Nėra sugeneruotų planų</h2>
          <p className="text-gray-500 mb-8">Grįžkite į pagrindinį puslapį ir sugeneruokite savo pirmąjį kelionės planą.</p>
          <Link href="/" className="inline-flex items-center gap-2 bg-blue-600 text-white font-semibold px-6 py-3 rounded-xl">
            ← Kurti planą
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-100 sticky top-0 z-40">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-3">
            <Link href="/" className="text-gray-400 touch-manipulation py-1">← Atgal</Link>
            <div className="h-5 w-px bg-gray-200" />
            <span className="font-bold text-gray-900">✈️ AI Kelionių Planeris</span>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={downloadKML} className="px-4 py-2.5 bg-green-600 active:bg-green-800 text-white text-sm font-medium rounded-lg touch-manipulation">🗺️ KML</button>
            <button onClick={() => window.print()} className="px-4 py-2.5 bg-blue-600 active:bg-blue-800 text-white text-sm font-medium rounded-lg touch-manipulation">🖨️ PDF</button>
          </div>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="lg:grid lg:grid-cols-[1fr_300px] lg:gap-8">
          <div>
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-6 sm:p-8 text-white mb-6">
              <div className="flex items-start justify-between flex-wrap gap-4">
                <div>
                  <h1 className="text-2xl sm:text-3xl font-extrabold mb-2">{plan.title}</h1>
                  <p className="text-blue-100 leading-relaxed max-w-xl">{plan.summary}</p>
                  {plan.meta && (
                    <div className="flex flex-wrap gap-2 mt-4">
                      {[
                        { icon: "📍", label: plan.meta.destination },
                        { icon: "📅", label: `${plan.meta.duration} dienos` },
                        { icon: "🎯", label: plan.meta.style },
                        { icon: "💶", label: plan.meta.budget },
                      ].map((tag) => (
                        <span key={tag.label} className="flex items-center gap-1 bg-white/20 text-white text-xs px-2.5 py-1 rounded-full">
                          {tag.icon} {tag.label}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
                <div className="bg-white/20 rounded-xl px-5 py-3 text-center flex-shrink-0">
                  <div className="text-blue-100 text-xs">Biudžetas</div>
                  <div className="text-2xl font-bold">{plan.budget_estimate.total_min}–{plan.budget_estimate.total_max}</div>
                  <div className="text-blue-100 text-sm">{plan.budget_estimate.currency}</div>
                </div>
              </div>
            </div>

            <div className="flex gap-1 bg-gray-100 rounded-xl p-1 mb-6">
              {(["itinerary", "budget", "info"] as const).map((tab) => (
                <button key={tab} onClick={() => setActiveTab(tab)}
                  className={`flex-1 py-2.5 px-2 rounded-lg text-xs sm:text-sm font-semibold touch-manipulation ${
                    activeTab === tab ? "bg-white text-blue-700 shadow-sm" : "text-gray-500"
                  }`}>
                  {tab === "itinerary" && "📅 Dienoraštis"}
                  {tab === "budget" && "💶 Biudžetas"}
                  {tab === "info" && "ℹ️ Informacija"}
                </button>
              ))}
            </div>

            {activeTab === "itinerary" && (
              <div className="space-y-4">
                {plan.days.map((day, i) => <DayCard key={day.day} day={day} dayIndex={i} />)}
              </div>
            )}
            {activeTab === "budget" && <BudgetTable budget={plan.budget_estimate} />}
            {activeTab === "info" && (
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4">
                  <h3 className="text-white font-bold text-lg">Praktinė informacija</h3>
                </div>
                <div className="divide-y divide-gray-50">
                  {[
                    { icon: "🌤️", label: "Geriausia data", value: plan.practical_info.best_time },
                    { icon: "🛂", label: "Viza", value: plan.practical_info.visa },
                    { icon: "💰", label: "Valiuta", value: plan.practical_info.currency },
                    { icon: "🗣️", label: "Kalba", value: plan.practical_info.language },
                    { icon: "🚑", label: "Pagalba", value: plan.practical_info.emergency },
                  ].map((item) => (
                    <div key={item.label} className="flex items-start gap-4 px-6 py-4">
                      <span className="text-2xl flex-shrink-0">{item.icon}</span>
                      <div>
                        <div className="text-xs text-gray-500 font-medium mb-0.5">{item.label}</div>
                        <div className="text-gray-900">{item.value}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <aside className="mt-8 lg:mt-0">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm sticky top-24">
              <div className="px-5 py-4 border-b border-gray-100">
                <h3 className="font-semibold text-gray-900">Išsaugoti planai</h3>
                <p className="text-gray-500 text-xs mt-0.5">Paskutiniai 3</p>
              </div>
              <div className="p-3 space-y-2">
                {savedPlans.length === 0 ? (
                  <p className="text-gray-400 text-sm text-center py-4">Nėra išsaugotų planų</p>
                ) : savedPlans.map((saved, i) => (
                  <button key={i} onClick={() => loadSavedPlan(saved)}
                    className={`w-full text-left p-3 rounded-xl border-2 touch-manipulation ${
                      saved.title === plan.title ? "border-blue-500 bg-blue-50" : "border-gray-100"
                    }`}>
                    <div className="font-medium text-gray-900 text-sm truncate">{saved.title}</div>
                    {saved.meta && <div className="text-gray-500 text-xs mt-0.5">{saved.meta.destination} · {saved.meta.duration}d</div>}
                  </button>
                ))}
              </div>
              <div className="px-4 pb-4 pt-2">
                <Link href="/" className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white font-medium py-3 rounded-xl text-sm touch-manipulation">
                  + Naujas planas
                </Link>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
