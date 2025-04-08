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

// 정답 선택
export const handleCheckAnswer = (
  id: string,
  options: ProblemList[],
  setOptions: React.Dispatch<React.SetStateAction<ProblemList[]>>
) => {
  const alreadySelected = options.some((opt) => opt.isCorrect);
  const targetOption = options.find((opt) => opt.id === id);

  if (alreadySelected && !targetOption?.isCorrect) {
    showToast("이미 정답이 선택되었습니다");
    return;
  }

  setOptions((prev) =>
    prev.map((opt) =>
      opt.id === id ? { ...opt, isCorrect: !opt.isCorrect } : opt
    )
  );
};
