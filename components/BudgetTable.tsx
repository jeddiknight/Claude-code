"use client";
import { BudgetEstimate } from "@/lib/types";

const labels: Record<string,string> = {
  flights: "✈️ Skrydžiai",
  accommodation: "🏨 Apgyvendinimas",
  food: "🍽️ Maistas",
  activities: "🎯 Veiklos",
  transport: "🚌 Transportas",
};

export default function BudgetTable({ budget }: { budget: BudgetEstimate }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4">
        <h3 className="text-white font-bold text-lg">Biudžeto suvestinė</h3>
        <p className="text-blue-100 text-sm mt-1">Preliminari kaina: {budget.total_min}–{budget.total_max} {budget.currency}</p>
      </div>
      <div className="divide-y divide-gray-50">
        {Object.entries(budget.breakdown).map(([key, value]) => (
          <div key={key} className="flex items-center justify-between px-6 py-3.5">
            <span className="text-gray-700 font-medium">{labels[key] ?? key}</span>
            <span className="text-blue-700 font-semibold bg-blue-50 px-3 py-1 rounded-full text-sm">{value}</span>
          </div>
        ))}
      </div>
      <div className="px-6 py-4 bg-blue-50 flex items-center justify-between">
        <span className="font-bold text-gray-800">Iš viso</span>
        <span className="font-bold text-blue-700 text-lg">{budget.total_min}–{budget.total_max} {budget.currency}</span>
      </div>
    </div>
  );
}
