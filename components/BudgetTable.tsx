"use client";

import { BudgetEstimate } from "@/lib/types";

interface BudgetTableProps {
  budget: BudgetEstimate;
}

const categories = [
  { key: "flights", icon: "✈️", label: "Skrydžiai", sub: "Pirmyn-atgal" },
  { key: "accommodation", icon: "🏨", label: "Apgyvendinimas", sub: "Per naktį" },
  { key: "food", icon: "🍽️", label: "Maistas", sub: "Per dieną" },
  { key: "activities", icon: "🎯", label: "Veiklos ir bilietai", sub: "Iš viso" },
  { key: "transport", icon: "🚌", label: "Vietinis transportas", sub: "Iš viso" },
];

export default function BudgetTable({ budget }: BudgetTableProps) {
  const hasDailyRate = budget.per_person_per_day_min && budget.per_person_per_day_max;

  return (
    <div className="space-y-4">
      {/* Total banner */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-6 text-white">
        <p className="text-blue-100 text-sm font-medium mb-1">Bendras biudžetas (apytiksliai)</p>
        <div className="text-4xl font-extrabold">
          {budget.total_min}–{budget.total_max}
          <span className="text-2xl ml-2">{budget.currency}</span>
        </div>
        {hasDailyRate && (
          <p className="text-blue-200 text-sm mt-2">
            ≈ {budget.per_person_per_day_min}–{budget.per_person_per_day_max} {budget.currency} / dienai
          </p>
        )}
      </div>

      {/* Breakdown */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-5 py-3 border-b border-gray-100">
          <h3 className="font-semibold text-gray-800">Išlaidų pasiskirstymas</h3>
        </div>
        <div className="divide-y divide-gray-50">
          {categories.map(({ key, icon, label, sub }) => {
            const value = budget.breakdown[key as keyof typeof budget.breakdown];
            if (!value) return null;
            return (
              <div key={key} className="flex items-center gap-4 px-5 py-4 hover:bg-gray-50 transition-colors">
                <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center text-xl flex-shrink-0">
                  {icon}
                </div>
                <div className="flex-1">
                  <p className="font-medium text-gray-800 text-sm">{label}</p>
                  <p className="text-gray-400 text-xs">{sub}</p>
                </div>
                <span className="font-semibold text-blue-700 bg-blue-50 px-3 py-1.5 rounded-full text-sm">
                  {value}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Tips */}
      <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4">
        <p className="text-amber-800 text-sm">
          <span className="font-semibold">💡 Patarimas: </span>
          Kainos yra apytikslės ir gali skirtis priklausomai nuo sezono, rezervavimo laiko ir individualių pasirinkimų.
        </p>
      </div>
    </div>
  );
}
