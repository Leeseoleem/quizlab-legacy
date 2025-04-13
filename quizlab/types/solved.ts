import { Timestamp } from "firebase/firestore";

export type SolvedMode = "timed" | "free" | "review"; // 기본 모드

// user_info/{userId}/solved_folders/{folderId}/problems/{problemId}

// 상위 문서: solved_folders/{folderId}
export type SolvedFolderDoc = {
  folderId: string; // 풀이한 폴더 ID
  mode: SolvedMode; // 풀이 모드
  totalCount: number; // 전체 문제 수
  correctCount: number; // 맞춘 문제 수
  startedAt: Timestamp; // 시작 시각
  submittedAt: Timestamp; // 제출 시각
  accuracy: number; // 정확도 (%)
  duration: number; // 소요 시간 (초)
};

// 하위 문서: problems/{problemId}
export type SolvedProblemDoc = {
  problemId: string; // 푼 문제 ID
  type: "descriptive" | "choice"; // 문제 유형
  question: string; // 문제
  correctAnswer: string; // 실제 정답
  userAnswer: string; // 사용자 입력 정답
  isCorrect: boolean; // 정답 여부
  memoText?: string; // 메모 내역
  hasMemo?: boolean; // 메모 여부
};

export type ProblemWithUserAnswer = {
  id: string; // problemId
  type: "descriptive" | "choice";
  question: string;
  correctAnswer: string; // 실제 정답
  userAnswer: string; // 사용자 입력 정답
};
