import React, { useEffect, useState } from "react";
import { router, useLocalSearchParams } from "expo-router";
import { View, Text } from "react-native";

import { getUserProblems } from "@/utils/cloud/problems";
import { ProblemInput } from "@/types/problems";
import SolveScreen from "@/components/ui/screen/solve/SolveScreen";
import safeParam from "@/utils/params";

export default function TimedScreen() {
  const { folderId, title, mode, hour, minute } = useLocalSearchParams();
  const [remainingSeconds, setRemainingSeconds] = useState<number>(0);

  // 시간 저장 변수
  useEffect(() => {
    console.log(hour, minute);
    const h = Number(hour ?? "0");
    const m = Number(minute ?? "0");

    const totalSeconds = h * 3600 + m * 60;
    setRemainingSeconds(totalSeconds);
  }, []);

  // 타이머 로직
  useEffect(() => {
    if (mode !== "timed") return;

    const timer = setInterval(() => {
      setRemainingSeconds((prev) => {
        if (!prev) return 0;

        if (prev <= 1) {
          clearInterval(timer);
          handleAutoSubmit();
          return 0;
        }

        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [remainingSeconds]);

  const handleAutoSubmit = () => {
    console.log("시간 종료");
  };

  const [problems, setProblems] = useState<ProblemInput[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answerText, setAnswerText] = useState("");

  useEffect(() => {
    console.log("🟡 currentIndex:", currentIndex);
    console.log("🟢 current 문제:", problems[currentIndex]);
  }, [currentIndex]);

  const current = problems[currentIndex]; // currentIndex에 해당하는 문제 한 개 객체
  const isFirst = currentIndex === 0;
  const isLast = currentIndex === problems.length - 1;

  useEffect(() => {
    if (!folderId) return;

    const fetch = async () => {
      const data = await getUserProblems(folderId as string);
      setProblems(data);
    };

    fetch();
  }, [folderId]);

  if (!current) {
    return <Text>문제를 불러오는 중...</Text>;
  }

  return (
    <SolveScreen
      title={safeParam(title)}
      remainingSeconds={remainingSeconds}
      mode="timed"
      current={currentIndex + 1}
      total={problems.length}
      type={current.type}
      questionText={current.question}
      answerText={answerText}
      onChangeText={setAnswerText}
      isFirst={isFirst}
      isLast={isLast}
      onPrev={() => setCurrentIndex((i) => i - 1)}
      onNext={() => setCurrentIndex((i) => i + 1)}
      onSubmit={() => console.log("제출")}
    />
  );
}
