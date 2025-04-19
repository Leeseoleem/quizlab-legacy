import React from "react";
import { submitAndRedirect } from "../submitAndRedirect";
import { SolvedMode, SolvedProblemDoc } from "@/types/solved";

// 현재 문제의 사용자 입력 반영
export function updateSolvingAnswer(
  solving: SolvedProblemDoc[],
  index: number,
  answer: string,
  selectedOptionId?: string
) {
  return solving.map((item, i) => {
    if (i !== index) return item;
    if (item.type === "choice" && item.options && selectedOptionId) {
      const updatedOptions = item.options.map((opt) => ({
        ...opt,
        userCheck: opt.id === selectedOptionId,
      }));
      return {
        ...item,
        index,
        options: updatedOptions,
        userAnswer: selectedOptionId,
      };
    }
    return { ...item, index, userAnswer: answer };
  });
}

type SubmitArgs = {
  startedAt: Date;
  setStartAt: React.Dispatch<React.SetStateAction<Date>>;
  solving: SolvedProblemDoc[];
  currentIndex: number;
  answerText: string;
  setIncompleteModal: React.Dispatch<React.SetStateAction<boolean>>;
  folderId: string;
  mode: SolvedMode;
  remainingSeconds?: number;
};

// 문제 제출 함수
export const handleSubmit = (args: SubmitArgs) => {
  const {
    startedAt,
    setStartAt,
    solving,
    currentIndex,
    answerText,
    setIncompleteModal,
    folderId,
    mode,
    remainingSeconds,
  } = args;

  const updatedSolving = solving.map((item, i) => {
    if (i !== currentIndex) return item;
    if (item.type === "descriptive") {
      return { ...item, index: currentIndex, userAnswer: answerText };
    }
    return item;
  });

  const hasEmpty = updatedSolving.some((p) =>
    p.type === "descriptive"
      ? p.userAnswer === ""
      : !p.options?.some((opt) => opt.userCheck)
  );

  if (hasEmpty) {
    setStartAt(startedAt);
    setIncompleteModal(true);
    return;
  }

  submitAndRedirect({
    folderId,
    mode,
    solving: updatedSolving,
    startedAt,
    remainingSeconds,
  });
};

type SubmitProps = {
  startedAt: Date;
  folderId: string;
  mode: SolvedMode;
  solving: SolvedProblemDoc[];
  remainingSeconds?: number;
};

// 강제 제출 함수: 사용자가 모든 문제를 다 풀지 않았더라도 강제로 제출을 실행함
export const forceSubmit = ({
  startedAt,
  folderId,
  mode,
  solving,
  remainingSeconds,
}: SubmitProps) => {
  if (!startedAt) return;

  // 제출 및 페이지 전환 함수 호출
  submitAndRedirect({
    folderId, // 현재 문제 폴더의 ID
    mode, // 풀이 모드: 시간 제한 모드
    solving, // 사용자의 전체 풀이 상태 배열
    startedAt, // 퀴즈 시작 시간
    remainingSeconds, // 타이머 제한 시간 (총 초 단위)
  });
};
