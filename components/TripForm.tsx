"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { TripFormData, TravelStyle, Budget, Language } from "@/lib/types";
import LoadingSpinner from "./LoadingSpinner";

const STYLES: TravelStyle[] = ["Aktyvus", "Paplūdimys", "Kultūra", "Nardymas", "Mišrus"];
const BUDGETS: Budget[] = ["Taupus <50€/d", "Vidutinis 50-150€/d", "Komfortiškas 150€+/d"];
const LANGUAGES: Language[] = ["Lietuvių", "English", "Norsk", "Latviešu"];

const styleIcons: Record<TravelStyle, string> = {
  Aktyvus: "🏃",
  Paplūdimys: "🏖️",
  Kultūra: "🏛️",
  Nardymas: "🤿",
  Mišrus: "🌍",
};

export default function TripForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState<TripFormData>({
    destination: "",
    duration: 7,
    style: "Mišrus",
    budget: "Vidutinis 50-150€/d",
    language: "Lietuvių",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.destination.trim()) {
      setError("Įveskite destinaciją");
      return;
    }
    setError(null);
    setLoading(true);

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error ?? `Klaida: ${res.status}`);
      }

      const plan = await res.json();

      const stored = JSON.parse(localStorage.getItem("travelPlans") ?? "[]");
      const updated = [
        { ...plan, meta: { ...form, generatedAt: new Date().toISOString() } },
        ...stored,
      ].slice(0, 3);
      localStorage.setItem("travelPlans", JSON.stringify(updated));
      localStorage.setItem("currentPlan", JSON.stringify(updated[0]));

      router.push("/results");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Nežinoma klaida");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {loading && <LoadingSpinner />}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            🌍 Destinacija
          </label>
          <input
            type="text"
            placeholder="pvz. Tailandas, Japonija, Italija..."
            value={form.destination}
            onChange={(e) => setForm({ ...form, destination: e.target.value })}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-gray-50 text-gray-900 placeholder-gray-400"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            📅 Trukmė: <span className="text-blue-600">{form.duration} dienos</span>
          </label>
          <input
            type="range"
            min={1}
            max={30}
            value={form.duration}
            onChange={(e) => setForm({ ...form, duration: Number(e.target.value) })}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
          />
          <div className="flex justify-between text-xs text-gray-400 mt-1">
            <span>1 d.</span>
            <span>15 d.</span>
            <span>30 d.</span>
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            🎯 Kelionės stilius
          </label>
          <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
            {STYLES.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setForm({ ...form, style: s })}
                className={`flex flex-col items-center gap-1 p-3 rounded-xl border-2 transition-all text-sm touch-manipulation ${
                  form.style === s
                    ? "border-blue-500 bg-blue-50 text-blue-700"
                    : "border-gray-200 active:border-gray-400 text-gray-600"
                }`}
              >
                <span className="text-2xl">{styleIcons[s]}</span>
                <span className="font-medium text-xs leading-tight text-center">{s}</span>
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            💶 Biudžetas
          </label>
          <div className="space-y-2">
            {BUDGETS.map((b) => (
              <label
                key={b}
                className={`flex items-center gap-3 p-3.5 rounded-xl border-2 cursor-pointer transition-all ${
                  form.budget === b
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <input
                  type="radio"
                  name="budget"
                  value={b}
                  checked={form.budget === b}
                  onChange={() => setForm({ ...form, budget: b })}
                  className="accent-blue-600"
                />
                <span className={`font-medium ${form.budget === b ? "text-blue-700" : "text-gray-700"}`}>
                  {b}
                </span>
              </label>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            🗣️ Plano kalba
          </label>
          <select
            value={form.language}
            onChange={(e) => setForm({ ...form, language: e.target.value as Language })}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 text-gray-900"
          >
            {LANGUAGES.map((l) => (
              <option key={l} value={l}>{l}</option>
            ))}
          </select>
        </div>

        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm flex items-start gap-2">
            <span className="text-red-500 flex-shrink-0">⚠️</span>
            <span>{error}</span>
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-gradient-to-r from-blue-600 to-blue-700 active:from-blue-800 active:to-blue-900 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-4 px-6 rounded-xl transition-all shadow-lg text-lg touch-manipulation min-h-[56px]"
        >
          {loading ? "Generuojama..." : "✨ Generuoti planą"}
        </button>
      </form>
    </>
  );
}
