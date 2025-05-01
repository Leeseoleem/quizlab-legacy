export type Weekday = "월" | "화" | "수" | "목" | "금" | "토" | "일";

export type WeekDateInfo = {
  date: string; // "YYYY-MM-DD"
  day: Weekday; // "월" ~ "일"
};

export const getThisWeekDatesWithDay = (): WeekDateInfo[] => {
  const weekdays: Weekday[] = ["일", "월", "화", "수", "목", "금", "토"];
  const today = new Date();
  const day = today.getDay(); // 일요일: 0, 월요일: 1 ...
  const diffToMonday = (day + 6) % 7;

  const monday = new Date(today);
  monday.setDate(today.getDate() - diffToMonday);

  const result: WeekDateInfo[] = [];

  for (let i = 0; i < 7; i++) {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    result.push({
      date: d.toISOString().slice(0, 10),
      day: weekdays[d.getDay()], // getDay(): 0~6 → "일"~"토"
    });
  }

  return result;
};
