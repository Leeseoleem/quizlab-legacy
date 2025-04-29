import { Timestamp } from "firebase/firestore";

export type SolvedMode = "timed" | "free" | "review"; // 기본 모드

// user_info/{userId}/solved_folders/{folderId}/{여기에 자동 추가}/problems/{problemId}

// 상위 문서: solved_folders/{folderId}
export type SolvedFolderDoc = {
  folderId: string; // 풀이한 폴더 ID
  mode: SolvedMode; // 풀이 모드
  startedAt: Timestamp; // 시작 시각
  submittedAt: Timestamp; // 제출 시각
  date: string; // 푼 날짜
  totalCount: number; // 전체 문제 수
  correctCount: number; // 맞춘 문제 수
  accuracy: number; // 정확도 (%)
  duration: number; // 소요 시간 (초)
  timeLimit?: number; // 사용자가 설정한 제한 시간: timed 모드 전용
};

export type SolvedFolderWithId = SolvedFolderDoc & { id: string };

// 객관식 선택지
export type CheckOption = {
  id: string; // 선택지 고유 ID
  text: string; // 선택지 텍스트
  isCorrect: boolean; // 정답 여부
  userCheck: boolean; // 사용자가 선택했는지 여부
};

// 하위 문서: problems/{problemId}
export type SolvedProblemDoc = {
  problemId: string; // 푼 문제 ID
  index: number; // 문제 순서를 위한 인덱스
  type: "descriptive" | "choice"; // 문제 유형
  question: string; // 문제
  correctAnswer: string; // 실제 정답
  userAnswer: string; // 사용자 입력 정답
  isCorrect: boolean; // 정답 여부
  memoText?: string; // 메모 내역
  hasMemo?: boolean; // 메모 여부
  options?: CheckOption[];
};
