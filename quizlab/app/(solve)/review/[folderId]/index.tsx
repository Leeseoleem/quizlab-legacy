import React, { useEffect, useState } from "react";
import { router, useLocalSearchParams } from "expo-router";
import { View, BackHandler } from "react-native";

import { getUserProblems } from "@/utils/cloud/problems";
import { ProblemType } from "@/types/problems";
import { SolvedMode, SolvedProblemDoc } from "@/types/solved";
import safeParam from "@/utils/params";
import {
  updateSolvingAnswer,
  handleSubmit,
  forceSubmit,
} from "@/utils/solve/solveUtils";

import SolveScreen from "@/components/ui/screen/solve/SolveScreen";
import { BackPressModal } from "@/components/ui/modal/screenModal/BackPressModal";
import { IncompleteAnswersModal } from "@/components/ui/modal/screenModal/IncompleteAnswersModal";
import GetProblemScreen from "@/components/ui/screen/solve/GetProblemScreen";

export default function ReviewScreen() {
  const { folderId, title, mode } = useLocalSearchParams();

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
  const [answerVisible, setAnswerVisible] = useState(false);

  const current = problems[currentIndex];
  const isFirst = currentIndex === 0;
  const isLast = currentIndex === problems.length - 1;

  useEffect(() => {
    console.log(current);
  }, [current]);

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

  useEffect(() => {
    if (solving.length > 0) {
      setAnswerText(solving[currentIndex]?.userAnswer ?? "");
    }
  }, [currentIndex, solving]);

  const [startedAt, setStartAt] = useState<Date>(new Date());
  const [incompleteModal, setIncompleteModal] = useState(false);

  const handleSelectOption = (optionId: string) => {
    // 선택지 클릭 시 새로운 solving 배열 생성 → 상태 업데이트
    setSolving(updateSolvingAnswer(solving, currentIndex, "", optionId));
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
          const forceData = {
            startedAt: startedAt,
            folderId: safeParam(folderId),
            mode: "review" as SolvedMode,
            solving: solving,
          };
          forceSubmit(forceData);
        }}
      />
      <SolveScreen
        title={safeParam(title)}
        mode="review"
        current={currentIndex + 1}
        total={problems.length}
        type={current.type}
        viewType="toggle"
        answerVisible={answerVisible}
        setAnswerVisible={setAnswerVisible}
        correctAnswer={
          current.type === "descriptive"
            ? current.answer
            : current.options.find((opt) => opt.isCorrect === true)?.text
        }
        questionText={current.question}
        // 문제 유형에 따른 분기
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
            setSolving(updateSolvingAnswer(solving, currentIndex, answerText));
          }
          setAnswerVisible(false);
          setCurrentIndex((i) => i - 1);
        }}
        onNext={() => {
          if (current.type === "descriptive") {
            setSolving(updateSolvingAnswer(solving, currentIndex, answerText));
          }
          setAnswerVisible(false);
          setCurrentIndex((i) => i + 1);
        }}
        onSubmit={() => {
          const args = {
            startedAt: startedAt,
            setStartAt: setStartAt,
            solving: solving,
            currentIndex: currentIndex,
            answerText: answerText,
            setIncompleteModal: setIncompleteModal,
            folderId: safeParam(folderId),
            mode: "review" as SolvedMode,
          };
          setTimeout(() => {
            handleSubmit(args);
          }, 0);
        }}
      />
    </View>
  );
}
