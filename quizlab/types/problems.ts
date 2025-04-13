// 주관식 문제
export type DescriptiveInput = {
  type: "descriptive";
  folderId: string;
  question: string;
  answer: string;
  imageUrl?: string;
};

// 객관식 문제
export type ChoiceInput = {
  type: "choice";
  folderId: string;
  question: string;
  options: ChoiceOption[];
  imageUrl?: string;
};

// 객관식 선택지
export type ChoiceOption = {
  text: string;
  isCorrect: boolean;
};

// 문제 통합 타입
export type ProblemInput = DescriptiveInput | ChoiceInput;

// UI/화면에 사용될 문제 타입 (Firestore 문서 ID 포함)
export type ProblemType = ProblemInput & { id: string };

export type SolvedMode = "timed" | "free" | "review";
