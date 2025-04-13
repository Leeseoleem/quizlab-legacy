export const formatTime = (seconds: number) => {
  const h = Math.floor(seconds / 3600); // 시간
  const m = Math.floor((seconds % 3600) / 60); // 분
  const s = seconds % 60; // 초

  const pad = (n: number) => String(n).padStart(2, "0");
  return `${pad(h)} : ${pad(m)} : ${pad(s)}`;
};
