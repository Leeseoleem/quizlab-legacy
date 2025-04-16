import React, { useEffect, useState } from "react";
import { router, useLocalSearchParams } from "expo-router";
import { View, BackHandler } from "react-native";

import { getUserProblems } from "@/utils/cloud/problems";
import { ProblemType } from "@/types/problems";
import { SolvedProblemDoc } from "@/types/solved";
import safeParam from "@/utils/params";
import { submitAndRedirect } from "@/utils/submitAndRedirect";

import SolveScreen from "@/components/ui/screen/solve/SolveScreen";
import { BackPressModal } from "@/components/ui/modal/screenModal/BackPressModal";
import showToast from "@/utils/showToast";
import { IncompleteAnswersModal } from "@/components/ui/modal/screenModal/IncompleteAnswersModal";
import GetProblemScreen from "@/components/ui/screen/solve/GetProblemScreen";

export default function TimedScreen() {
  const { folderId, title, mode, hour, minute } = useLocalSearchParams();
  const [settingTimer, setSettingTimer] = useState<number>(0);
  const [remainingSeconds, setRemainingSeconds] = useState<number>(0);

  useEffect(() => {
    const h = Number(hour ?? "0");
    const m = Number(minute ?? "0");
    const totalSeconds = h * 3600 + m * 60;
    setRemainingSeconds(totalSeconds);
    setSettingTimer(totalSeconds);
  }, []);

  useEffect(() => {
    if (mode !== "timed") return;
    const timer = setInterval(() => {
      setRemainingSeconds((prev) => {
        if (!prev) return 0;
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [remainingSeconds]);

  const [visible, setVisible] = useState(false);
  const handelBackPress = () => {
    setVisible(true);
    return true;
  };
  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      handelBackPress
    );
    return () => backHandler.remove();
  });

  const [problems, setProblems] = useState<ProblemType[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answerText, setAnswerText] = useState("");
  const [solving, setSolving] = useState<SolvedProblemDoc[]>([]);

  const current = problems[currentIndex];
  const isFirst = currentIndex === 0;
  const isLast = currentIndex === problems.length - 1;

  useEffect(() => {
    if (!folderId) return;
    const fetch = async () => {
      const data = await getUserProblems(folderId as string, "asc");
      setProblems(data);
    };
    fetch();
  }, [folderId]);

  useEffect(() => {
    if (problems.length > 0) {
      const initialSolving: SolvedProblemDoc[] = problems.map(
        (problem, idx) => ({
          problemId: problem.id,
          index: idx,
          type: problem.type,
          question: problem.question,
          correctAnswer:
            problem.type === "descriptive"
              ? problem.answer
              : problem.options.find((opt) => opt.isCorrect)?.text ?? "",
          userAnswer: "",
          isCorrect: false,
          memoText: "",
          hasMemo: false,
          options:
            problem.type === "choice"
              ? problem.options.map((opt) => ({ ...opt, userCheck: false }))
              : undefined,
        })
      );
      setSolving(initialSolving);
    }
  }, [problems]);

  const updateSolvingAnswer = (
    index: number,
    answer: string,
    selectedOptionId?: string
  ) => {
    setSolving((prev) =>
      prev.map((item, i) => {
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
      })
    );
  };

  useEffect(() => {
    if (solving.length > 0) {
      setAnswerText(solving[currentIndex]?.userAnswer ?? "");
    }
  }, [currentIndex, solving]);

  const [startedAt, setStartAt] = useState<Date>();
  const [incompleteModal, setIncompleteModal] = useState(false);

  const handleSelectOption = (optionId: string) => {
    updateSolvingAnswer(currentIndex, "", optionId);
  };

  const handleSubmit = (startedAt: Date) => {
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
      folderId: safeParam(folderId),
      mode: "timed",
      solving: updatedSolving,
      startedAt,
      remainingSeconds: settingTimer,
    });
  };

  const handleTimeout = (startedAt: Date) => {
    const updatedSolving = solving.map((item, i) => {
      if (i !== currentIndex) return item;
      if (item.type === "descriptive") {
        return { ...item, index: currentIndex, userAnswer: answerText };
      }
      return item;
    });

    showToast("시간이 초과되었습니다");

    submitAndRedirect({
      folderId: safeParam(folderId),
      mode: "timed",
      solving: updatedSolving,
      startedAt,
      remainingSeconds: settingTimer,
    });
  };

  if (!current) return <GetProblemScreen />;

  return (
    <View style={{ flex: 1 }}>
      <BackPressModal
        visible={visible}
        onRequestClose={() => setVisible(false)}
        onPressOk={() => router.replace("/(tabs)/problem")}
      />
      <IncompleteAnswersModal
        visible={incompleteModal}
        onRequestClose={() => setIncompleteModal(false)}
        onPressOk={() => {
          if (startedAt) handleSubmit(startedAt);
        }}
      />
      <SolveScreen
        title={safeParam(title)}
        remainingSeconds={remainingSeconds}
        mode="timed"
        current={currentIndex + 1}
        total={problems.length}
        type={current.type}
        questionText={current.question}
        // ✨ 문제 유형에 따른 분기
        answerText={
          current.type === "descriptive"
            ? answerText
            : solving[currentIndex]?.userAnswer
        }
        onChangeText={
          current.type === "descriptive" ? setAnswerText : undefined
        }
        options={
          current.type === "choice" ? solving[currentIndex]?.options : undefined
        }
        onSelectOption={
          current.type === "choice" ? handleSelectOption : undefined
        }
        isFirst={isFirst}
        isLast={isLast}
        onPrev={() => {
          if (current.type === "descriptive") {
            updateSolvingAnswer(currentIndex, answerText);
          }
          setCurrentIndex((i) => i - 1);
        }}
        onNext={() => {
          if (current.type === "descriptive") {
            updateSolvingAnswer(currentIndex, answerText);
          }
          setCurrentIndex((i) => i + 1);
        }}
        onSubmit={handleSubmit}
        onTimeout={handleTimeout}
      />
    </View>
  );
}
