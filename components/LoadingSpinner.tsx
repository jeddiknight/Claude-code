"use client";

interface LoadingSpinnerProps {
  message?: string;
}

export default function LoadingSpinner({ message = "Generuojamas kelionės planas..." }: LoadingSpinnerProps) {
  return (
    <div className="fixed inset-0 bg-white/80 backdrop-blur-sm z-50 flex flex-col items-center justify-center">
      <div className="bg-white rounded-2xl shadow-2xl p-10 flex flex-col items-center gap-6 max-w-sm mx-4">
        <div className="relative w-20 h-20">
          <div className="absolute inset-0 rounded-full border-4 border-blue-100" />
          <div className="absolute inset-0 rounded-full border-4 border-t-blue-600 animate-spin" />
          <div className="absolute inset-2 rounded-full border-4 border-t-blue-300 animate-spin" style={{ animationDuration: "1.5s", animationDirection: "reverse" }} />
        </div>
        <div className="text-center">
          <p className="text-gray-800 font-semibold text-lg">{message}</p>
          <p className="text-gray-500 text-sm mt-2">Claude AI analizuoja jūsų kelionę...</p>
        </div>
        <div className="flex gap-1.5">
          {[0, 1, 2, 3].map((i) => (
            <div
              key={i}
              className="w-2 h-2 rounded-full bg-blue-600 animate-bounce"
              style={{ animationDelay: `${i * 0.15}s` }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
