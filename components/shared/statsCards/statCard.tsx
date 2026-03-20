import React from "react";

interface StatCardProps {
  title: string;
  value: string | number;
  currency?: string;
  percentage?: number;
  periodText?: string;
  icon?: React.ReactNode;
  variant?: "blue" | "purple";
}

export const StatCard = ({
  title,
  value,
  currency = "USD",
  percentage = 0,
  periodText = "Hoy",
  icon,
  variant = "blue",
}: StatCardProps) => {
  const bgColor = variant === "blue" ? "bg-[#5D7CFA]" : "bg-[#B766F4]";

  return (
    <div
      className={`${bgColor} rounded-2xl p-6 text-white relative overflow-hidden shadow-lg flex-1 min-w-[300px]`}
    >
      <div className="relative z-10 flex flex-col gap-4">
        <h3 className="text-lg font-medium opacity-90">{title}</h3>

        <div className="flex flex-col">
          <span className="text-4xl font-bold break-words">
            {value} <span className="text-2xl font-semibold">{currency}</span>
          </span>
        </div>

        <div className="flex items-center gap-2 mt-2">
          <div className="bg-[#26C991] px-3 py-1 rounded-lg flex items-center gap-1 text-sm font-bold">
            <span className="text-xs">↗</span> {percentage}%
          </div>
          <span className="text-sm opacity-80">{periodText}</span>
        </div>
      </div>
      {/* Icono de fondo */}
      <div className="absolute right-10 bottom-10 opacity-20 scale-[2.5] pointer-events-none">
        {icon}
      </div>
    </div>
  );
};
