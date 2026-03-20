"use client";

interface DashboardCardProps {
  title: string;
  children: React.ReactNode;
  className?: string;
  extra?: React.ReactNode;
}

export const DashboardCard = ({
  title,
  children,
  className = "",
  extra,
}: DashboardCardProps) => (
  <div
    className={`bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex flex-col ${className}`}
  >
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
      <h3 className="text-lg font-bold text-gray-800 leading-none">{title}</h3>
      <div className="flex flex-wrap items-center gap-2 self-start sm:self-auto shrink-0">
        {extra}
      </div>
    </div>
    <div className="w-full flex-1 overflow-hidden">{children}</div>
  </div>
);
