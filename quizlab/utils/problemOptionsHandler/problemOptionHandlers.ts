import showToast from "../showToast";

// 문제 옵션 타입
export type ProblemList = {
  id: string;
  text: string;
  isCorrect: boolean;
};

// 고유 ID 생성 유틸
export const generateId = () => `${Date.now()}-${Math.random()}`;

// 옵션 추가
export const handleAddOption = (
  options: ProblemList[],
  setOptions: React.Dispatch<React.SetStateAction<ProblemList[]>>,
  scrollToBottom?: () => void
) => {
  if (options.length >= 5) {
    showToast("최대 5개까지 추가할 수 있습니다");
    return;
  }

  const newOption: ProblemList = {
    id: generateId(),
    text: "",
    isCorrect: false,
  };

  setOptions((prev) => [...prev, newOption]);

  if (scrollToBottom) scrollToBottom();
};

// 옵션 제거
export const handleRemoveOption = (
  id: string,
  options: ProblemList[],
  setOptions: React.Dispatch<React.SetStateAction<ProblemList[]>>
) => {
  if (options.length <= 2) {
    showToast("최소 2개의 답변이 필요합니다");
    return;
  }

  setOptions((prev) => prev.filter((opt) => opt.id !== id));
};

// 텍스트 변경
export const handleOptionTextChange = (
  id: string,
  newText: string,
  setOptions: React.Dispatch<React.SetStateAction<ProblemList[]>>
) => {
  setOptions((prev) =>
    prev.map((opt) => (opt.id === id ? { ...opt, text: newText } : opt))
  );
};

// 정답 선택 핸들러
export const handleCheckAnswer = (
  id: string, // 현재 클릭한 항목의 id
  options: ProblemList[], // 현재 선택지 리스트
  setOptions: React.Dispatch<React.SetStateAction<ProblemList[]>> // 선택지 상태 업데이트 함수
) => {
  // 현재 클릭한 항목이 정답으로 선택되어 있는지 확인
  const targetOption = options.find((opt) => opt.id === id);
  const isAlreadyCorrect = targetOption?.isCorrect ?? false;

  if (isAlreadyCorrect) {
    // ✅ 현재 클릭한 항목이 이미 정답이면 → 해당 항목만 정답 해제
    setOptions((prev) =>
      prev.map((opt) => (opt.id === id ? { ...opt, isCorrect: false } : opt))
    );
  } else {
    // ✅ 현재 클릭한 항목이 정답이 아니면 →
    //    기존의 다른 정답들은 해제하고, 현재 항목만 정답으로 설정
    setOptions((prev) =>
      prev.map((opt) => ({
        ...opt,
        isCorrect: opt.id === id, // 현재 클릭한 항목만 true, 나머지는 false
      }))
    );
  }
};
