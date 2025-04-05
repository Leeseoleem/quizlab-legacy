const generateKeywords = (title: string): string[] => {
  const keywords = new Set<string>();
  const normalized = title.replace(/\s+/g, " "); // 여러 공백 → 하나로

  const words = normalized.split(" ");

  words.forEach((word) => {
    for (let start = 0; start < word.length; start++) {
      for (let end = start + 1; end <= word.length; end++) {
        keywords.add(word.slice(start, end));
      }
    }
  });

  return Array.from(keywords); // 중복 제거된 배열 반환
};

export { generateKeywords };
