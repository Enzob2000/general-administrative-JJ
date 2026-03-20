import { DateRange } from "../types/reportes.constants";

export type TimeRangeOption =
  | "hoy"
  | "7dias"
  | "15dias"
  | "mes_actual"
  | "mes_pasado"
  | "mes_minus_2"
  | "mes_minus_3"
  | "mes_minus_4"
  | "mes_minus_5";

export const getMonthName = (monthIndex: number): string => {
  const months = [
    "Enero",
    "Febrero",
    "Marzo",
    "Abril",
    "Mayo",
    "Junio",
    "Julio",
    "Agosto",
    "Septiembre",
    "Octubre",
    "Noviembre",
    "Diciembre",
  ];
  return months[monthIndex];
};

export const getTimeRangeDate = (option: TimeRangeOption): DateRange => {
  const now = new Date();
  const start = new Date();
  const end = new Date();

  switch (option) {
    case "hoy":
      start.setHours(0, 0, 0, 0);
      end.setHours(23, 59, 59, 999);
      break;
    case "7dias":
      start.setDate(now.getDate() - 7);
      start.setHours(0, 0, 0, 0);
      end.setHours(23, 59, 59, 999);
      break;
    case "15dias":
      start.setDate(now.getDate() - 15);
      start.setHours(0, 0, 0, 0);
      end.setHours(23, 59, 59, 999);
      break;
    case "mes_actual":
      return {
        start: new Date(
          now.getFullYear(),
          now.getMonth(),
          1,
          0,
          0,
          0,
        ).toISOString(),
        end: new Date(
          now.getFullYear(),
          now.getMonth() + 1,
          0,
          23,
          59,
          59,
        ).toISOString(),
      };
    case "mes_pasado":
      return {
        start: new Date(
          now.getFullYear(),
          now.getMonth() - 1,
          1,
          0,
          0,
          0,
        ).toISOString(),
        end: new Date(
          now.getFullYear(),
          now.getMonth(),
          0,
          23,
          59,
          59,
        ).toISOString(),
      };
    default:
      if (option.startsWith("mes_minus_")) {
        const minus = parseInt(option.split("_")[2]);
        return {
          start: new Date(
            now.getFullYear(),
            now.getMonth() - minus,
            1,
            0,
            0,
            0,
          ).toISOString(),
          end: new Date(
            now.getFullYear(),
            now.getMonth() - minus + 1,
            0,
            23,
            59,
            59,
          ).toISOString(),
        };
      }
  }

  return {
    start: start.toISOString(),
    end: end.toISOString(),
  };
};

export const getTimeRangeLabel = (option: TimeRangeOption): string => {
  const now = new Date();
  switch (option) {
    case "hoy":
      return "Hoy";
    case "7dias":
      return "Últimos 7 días";
    case "15dias":
      return "Últimos 15 días";
    case "mes_actual":
      return getMonthName(now.getMonth());
    case "mes_pasado": {
      const d = new Date(now.getFullYear(), now.getMonth() - 1);
      return getMonthName(d.getMonth());
    }
    default:
      if (option.startsWith("mes_minus_")) {
        const minus = parseInt(option.split("_")[2]);
        const d = new Date(now.getFullYear(), now.getMonth() - minus);
        return getMonthName(d.getMonth());
      }
      return option;
  }
};

export const TIME_RANGE_OPTIONS: TimeRangeOption[] = [
  "hoy",
  "7dias",
  "15dias",
  "mes_actual",
  "mes_pasado",
  "mes_minus_2",
  "mes_minus_3",
  "mes_minus_4",
  "mes_minus_5",
];
