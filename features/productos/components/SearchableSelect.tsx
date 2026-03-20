"use client";

import React, { useState, useMemo, useRef, useEffect } from "react";
import { RiSearchLine, RiArrowDownSLine, RiCloseLine } from "react-icons/ri";

interface SearchableSelectProps {
  label: string;
  value: string;
  options: string[];
  onChange: (val: string) => void;
  placeholder?: string;
  className?: string;
}

export const SearchableSelect = ({
  label,
  value,
  options,
  onChange,
  placeholder = "Buscar...",
  className = "",
}: SearchableSelectProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);

  const filteredOptions = useMemo(() => {
    if (!search) return options;
    const s = search.toLowerCase();
    return options.filter((o) => o?.toLowerCase().includes(s));
  }, [options, search]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className={`relative ${className}`} ref={containerRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex h-8 items-center justify-between rounded-xl border border-gray-200 bg-white px-3 text-xs font-semibold text-gray-700 outline-none hover:border-blue-400 focus:border-blue-500 transition-all min-w-[140px] gap-2"
      >
        <span className="truncate max-w-[100px]">{value || label}</span>
        <RiArrowDownSLine
          size={14}
          className={`text-gray-400 transition-transform ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      {isOpen && (
        <div className="absolute top-[calc(100%+4px)] left-0 z-50 min-w-[200px] max-h-[300px] flex flex-col rounded-2xl bg-white p-2 shadow-2xl border border-gray-100 animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="relative mb-2">
            <RiSearchLine
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              size={14}
            />
            <input
              autoFocus
              type="text"
              placeholder={placeholder}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full h-8 pl-9 pr-3 text-xs rounded-xl border border-gray-100 bg-gray-50 outline-none focus:border-blue-500 focus:bg-white transition-all"
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-0.5 hover:bg-gray-200 rounded-full transition-colors"
                type="button"
              >
                <RiCloseLine size={12} className="text-gray-400" />
              </button>
            )}
          </div>

          <div className="flex-1 overflow-y-auto custom-scrollbar flex flex-col gap-1">
            <button
              onClick={() => {
                onChange("");
                setIsOpen(false);
              }}
              className={`flex items-center px-3 py-2 text-xs rounded-xl transition-colors hover:bg-red-50 hover:text-red-600 ${
                !value
                  ? "bg-blue-50 text-blue-600 font-bold"
                  : "text-gray-600 font-medium"
              }`}
            >
              Todos
            </button>
            {filteredOptions.length === 0 ? (
              <div className="px-3 py-4 text-center text-xs text-gray-400 italic">
                No hay resultados
              </div>
            ) : (
              filteredOptions.map((opt) => (
                <button
                  key={opt}
                  onClick={() => {
                    onChange(opt);
                    setIsOpen(false);
                    setSearch("");
                  }}
                  className={`flex items-center px-3 py-2 text-xs rounded-xl transition-colors text-left ${
                    value === opt
                      ? "bg-blue-600 text-white font-bold"
                      : "text-gray-600 font-medium hover:bg-blue-50 hover:text-blue-600"
                  }`}
                >
                  {opt}
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};
