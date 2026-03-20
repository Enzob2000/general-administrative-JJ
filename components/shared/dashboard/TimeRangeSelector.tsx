"use client";

import {
  TimeRangeOption,
  TIME_RANGE_OPTIONS,
  getTimeRangeLabel,
} from "@/features/reportes/utils/dateFilters";
import { RiCalendarEventLine, RiArrowDownSLine } from "react-icons/ri";

interface TimeRangeSelectorProps {
  value: TimeRangeOption;
  onChange: (v: TimeRangeOption) => void;
}

export const TimeRangeSelector = ({
  value,
  onChange,
}: TimeRangeSelectorProps) => {
  return (
    <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-gray-100 hover:border-blue-200 transition-all group shrink-0 shadow-sm relative pr-6">
      <RiCalendarEventLine
        size={14}
        className="text-gray-400 group-hover:text-blue-500 transition-colors"
      />
      <select
        value={value}
        onChange={(e) => onChange(e.target.value as TimeRangeOption)}
        className="text-[10px] font-black uppercase tracking-widest bg-transparent outline-none text-gray-500 cursor-pointer appearance-none min-w-[80px] z-10"
      >
        {TIME_RANGE_OPTIONS.map((opt) => (
          <option key={opt} value={opt}>
            {getTimeRangeLabel(opt)}
          </option>
        ))}
      </select>
      <RiArrowDownSLine
        className="absolute right-2 text-gray-400 pointer-events-none group-hover:text-blue-500 transition-colors"
        size={14}
      />
    </div>
  );
};
