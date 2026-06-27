import TripForm from "@/components/TripForm";
import Link from "next/link";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-100 sticky top-0 z-40">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl">✈️</span>
            <span className="font-bold text-xl text-gray-900">AI Kelionių Planeris</span>
          </div>
          <Link href="/results" className="text-sm text-blue-600 font-medium">
            Mano planai →
          </Link>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-4 pt-12 pb-6 text-center">
        <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 text-sm font-medium px-4 py-1.5 rounded-full mb-6">
          <span>🤖</span> Powered by Claude AI
        </div>
        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 leading-tight mb-4">
          Sugeneruok savo{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
            tobulą kelionę
          </span>
        </h1>
        <p className="text-gray-500 text-lg max-w-xl mx-auto">
          Įveskite destinaciją ir gaukite išsamų kelionės planą su vietomis, biudžetu ir patarimais — per kelias sekundes.
        </p>
      </div>

      <div className="max-w-2xl mx-auto px-4 pb-16">
        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-5 sm:p-8">
          <TripForm />
        </div>
        <div className="grid grid-cols-3 gap-4 mt-8 text-center">
          {[
            { icon: "🗺️", title: "KML failas", desc: "Eksportuok į Google Maps" },
            { icon: "💾", title: "Išsaugoma", desc: "Paskutiniai 3 planai" },
            { icon: "🖨️", title: "Spausdinama", desc: "PDF formatas" },
          ].map((f) => (
            <div key={f.title} className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm">
              <div className="text-2xl mb-2">{f.icon}</div>
              <div className="font-semibold text-gray-800 text-sm">{f.title}</div>
              <div className="text-gray-500 text-xs mt-0.5">{f.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
