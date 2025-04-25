export const formatSmartDate = (date: any): string => {
  const d = date.toDate ? date.toDate() : date; // Firestore Timestamp 대응
  const now = new Date();

  const isSameDay =
    d.getFullYear() === now.getFullYear() &&
    d.getMonth() === now.getMonth() &&
    d.getDate() === now.getDate();

  if (isSameDay) {
    const diffMs = now.getTime() - d.getTime();
    const diffMin = Math.floor(diffMs / 1000 / 60);
    if (diffMin < 1) return "방금 전";
    if (diffMin < 60) return `${diffMin}분 전`;
    const diffHour = Math.floor(diffMin / 60);
    return `${diffHour}시간 전`;
  }

  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  const hours = String(d.getHours()).padStart(2, "0");
  const minutes = String(d.getMinutes()).padStart(2, "0");
  const timePeriod = parseInt(hours, 10) < 12 ? "AM" : "PM";

  return `${year}-${month}-${day} • ${timePeriod} ${hours}:${minutes}`;
};
