// utils/timeData.ts
export const hours = ["00", "01", "02"];
export const minutes = Array.from({ length: 60 }, (_, i) =>
  i.toString().padStart(2, "0")
);
