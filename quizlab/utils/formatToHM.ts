export const formatToHM = (seconds: number): string => {
  if (seconds === 0) {
    return "학습 전";
  }

  if (seconds < 60) {
    return "1분 미만"; // 초과 신경 안 씀, 1분으로 고정
  }

  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);

  const hh = h > 0 ? `${String(h)}시간 ` : "";
  const mm = `${String(m)}분`;

  return `${hh}${mm}`.trim();
};
