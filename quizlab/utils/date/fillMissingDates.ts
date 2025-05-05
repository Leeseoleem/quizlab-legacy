import { format, parseISO, addDays, differenceInDays } from "date-fns";
import { AccuracyPoint } from "../cloud/solved";

export const fillMissingDates = (data: AccuracyPoint[]): AccuracyPoint[] => {
  if (data.length === 0) return [];

  const start = parseISO(data[0].date);
  const end = parseISO(data[data.length - 1].date);

  const totalDays = differenceInDays(end, start);
  const filled: AccuracyPoint[] = [];

  for (let i = 0; i <= totalDays; i++) {
    const current = addDays(start, i);
    const dateStr = format(current, "yyyy-MM-dd");

    const existing = data.find((d) => d.date === dateStr);
    if (existing) {
      filled.push(existing);
    } else {
      filled.push({ date: dateStr, accuracy: 0 }); // 보간된 날짜는 0%
    }
  }

  return filled.slice(-5);
};
