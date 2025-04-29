export const formatToHM = (seconds: number): string => {
  if (seconds < 60) {
    return "1m"; // 초과 신경 안 씀, 1분으로 고정
  }

  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);

  const hh = h > 0 ? `${String(h)}h ` : "";
  const mm = `${String(m)}m`;

  return `${hh}${mm}`.trim();
};
