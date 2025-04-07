import React, { useState, useRef, useEffect, useCallback } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { ActivityIndicator, StyleSheet } from "react-native";
import {
  View,
  Text,
  FlatList,
  ScrollView, // 스크롤뷰(탭 바)
  KeyboardAvoidingView,
} from "react-native";
import { useLocalSearchParams, Link, router } from "expo-router";

import safeParam from "@/utils/params";
import { GrayColors, MainColors } from "@/constants/Colors";

import { auth } from "@/lib/firebaseConfig";
import {
  createProblem,
  getUserProblems,
  ProblemInput,
} from "@/utils/cloud/problems";

import Header from "@/components/ui/header";
import ProblemDetailList from "@/components/ui/list/ProblemDetailList";
import Button from "@/components/ui/button/Button";
import CreateProblemModal from "@/components/ui/modal/screenModal/CreateProblemModal";
import { MyType } from "@/components/ui/modal/screenModal/CreateProblemModal";

import ModalContainer from "@/components/ui/modal/ModalContainer";
import ModalLargeTextbox from "@/components/ui/modal/ModalLargeTextBox";
import showToast from "@/utils/showToast";

type ProblemList = {
  id: string;
  text: string;
  isCorrect: boolean;
};

// 고유 id 생성
const generateId = () => `${Date.now()}-${Math.random()}`;

export default function FolderDetailScreen() {
  const { folderId, title } = useLocalSearchParams();

  const [isLoading, setIsLoading] = useState(true);
  const [problemListData, setProblemListData] = useState<
    (ProblemInput & { id: string })[]
  >([]);

  const fetchProblems = useCallback(async () => {
    if (!folderId || typeof folderId !== "string") {
      showToast("유효하지 않은 폴더입니다.");
      setIsLoading(false);
      return;
    }

    try {
      const problems = await getUserProblems(folderId);
      setProblemListData(problems ?? []);
    } catch (error) {
      console.error("문제 불러오기 오류:", error);
      showToast("문제를 불러오는 중 오류가 발생했습니다.");
    } finally {
      setIsLoading(false);
    }
  }, [folderId]);

  useEffect(() => {
    fetchProblems();
  }, [folderId]);

  // 문제 생성 로직
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [type, setType] = useState<MyType>("descriptive");

  // 서술형
  const [problemText, setProblemText] = useState("");
  const [answerText, setAnswerText] = useState("");

  // 현재 위치
  const scrollRef = useRef<ScrollView>(null);

  const scrollViewRef = useRef<ScrollView>(null); // ref 생성

  const scrollToBottom = () => {
    scrollViewRef.current?.scrollToEnd({ animated: true });
  };

  // 선택형
  const [options, setOptions] = useState<ProblemList[]>([
    { id: generateId(), text: "", isCorrect: false },
    { id: generateId(), text: "", isCorrect: false },
  ]);

  // 선택형 문제 추가 함수
  const addOption = () => {
    if (options.length >= 5) {
      showToast("최대 5개까지 추가할 수 있습니다");
      return;
    }
    const newOption = {
      id: generateId(), // 고유 id 부여
      text: "", // 초기값은 빈 문자열
      isCorrect: false,
    };
    setOptions((prev) => [...prev, newOption]);
    scrollToBottom();
  };

  useEffect(() => {
    console.log(options);
  }, [options]);

  // 선택형 문제 삭제 함수
  const removeOption = (id: string) => {
    if (options.length <= 2) {
      showToast("최소 2개의 답변이 필요합니다");
      return;
    }
    setOptions((prev) => prev.filter((opt) => opt.id !== id));
  };

  // 문제 내용 수정 함수
  const handleTextChange = (id: string, newText: string) => {
    setOptions((prev) =>
      prev.map((opt) => {
        const next = opt.id === id ? { ...opt, text: newText } : opt;
        return next;
      })
    );
  };

  // 정답 문제 선택 함수
  const checkAnswer = (id: string) => {
    setOptions((prev) => {
      const alreadySelected = prev.some((opt) => opt.isCorrect);
      const targetOption = prev.find((opt) => opt.id === id);

      // 1. 이미 정답이 선택되어 있고
      // 2. 지금 누른 게 정답이 아니면 → 아무것도 안 함
      if (alreadySelected && !targetOption?.isCorrect) {
        showToast("이미 정답이 선택되었습니다");
        return prev;
      }

      // 아니면 toggle 가능
      return prev.map((opt) =>
        opt.id === id ? { ...opt, isCorrect: !opt.isCorrect } : opt
      );
    });
  };

  // 문제 생성
  const handelCreateProblem = async () => {
    const user = auth.currentUser;

    if (!user) {
      showToast("로그인이 만료되었습니다");
      router.replace("/(auth)/login");
      return;
    }

    try {
      if (type === "descriptive") {
        const problem = {
          type: type,
          folderId: folderId as string,
          question: problemText,
          answer: answerText,
        };
        await createProblem(problem);
      } else {
        // ✅ 정답 체크: isCorrect가 true인 옵션이 하나도 없다면 막기
        const hasCorrectAnswer = options.some((opt) => opt.isCorrect);
        if (!hasCorrectAnswer) {
          showToast("정답을 필수 1개 선택해야 합니다");
          return; // 저장 막기
        }

        const hasBlankText = options.some((opt) => opt.text.trim() !== "");
        if (!hasBlankText || problemText.trim() === "") {
          showToast("내용이 모두 작성되지 않았습니다");
          return; // 저장 막기
        }

        const problem = {
          type: type,
          folderId: folderId as string,
          question: problemText,
          options: options,
        };
        await createProblem(problem);
      }
      console.log("저장 완료");
    } catch (e) {
      showToast("오류가 발생했습니다");
    }
    await fetchProblems();
    handleCloseAddModal();
  };

  // 모달창 닫히는 로직
  const handleCloseAddModal = () => {
    setAddModalOpen(false);
    // 모달창 내 모든 내용 초가화
    setProblemText("");
    setAnswerText("");
    setOptions([
      { id: generateId(), text: "", isCorrect: false },
      { id: generateId(), text: "", isCorrect: false },
    ]);
    setType("descriptive");
  };

  return (
    <SafeAreaView style={styles.container}>
      <CreateProblemModal
        visible={addModalOpen}
        onRequestClose={handleCloseAddModal}
        onCreateProblem={handelCreateProblem}
        type={type}
        setType={setType}
        scrollRef={scrollRef}
        // 서술형 영역
        problemText={problemText}
        setProblemText={setProblemText}
        answerText={answerText}
        setAnswerText={setAnswerText}
        // 선택형 영역
        onAddProblem={addOption}
        option={options}
        handleTextChange={handleTextChange}
        checkAnswer={checkAnswer}
        onRemove={removeOption}
        scrollListRef={scrollViewRef}
      />

      <Header
        title={safeParam(title)}
        showBack={true}
        onPressBack={() => router.back()}
      />
      <View style={styles.contents}>
        {isLoading ? (
          <View>
            <ActivityIndicator size="large" color={MainColors.primary} />
          </View>
        ) : (
          <FlatList
            showsVerticalScrollIndicator={false}
            data={problemListData}
            keyExtractor={(item) => item.id}
            contentContainerStyle={{
              ...(problemListData.length === 0
                ? {
                    flexGrow: 1,
                    justifyContent: "center",
                  }
                : {}),
            }}
            renderItem={({ item }) => (
              <View
                style={{
                  marginBottom: 16,
                }}
              >
                <ProblemDetailList
                  type={item.type as "descriptive" | "choice"}
                  questionTitle={item.question ?? ""}
                  answerTitle={
                    item.type === "descriptive"
                      ? item.answer
                      : item.options
                          .filter((opt) => opt.isCorrect)
                          .map((opt) => opt.text)
                          .join("")
                  }
                />
              </View>
            )}
            ListEmptyComponent={
              <View
                style={{
                  flex: 1,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Text style={styles.guideText}>아직 작성된 문제가 없어요</Text>
                <Text style={styles.guideText}>새로운 문제를 추가해보세요</Text>
              </View>
            }
          />
        )}
        <View style={styles.bottomContents}>
          <View
            style={{
              width: "100%",
              alignItems: "center",
              marginBottom: 16,
            }}
          >
            <Button type="add" onPress={() => setAddModalOpen(true)} />
          </View>
          <View
            style={{
              width: "100%",
              alignItems: "center",
            }}
          >
            <Button
              type="default"
              btnTitle="문제 풀기"
              onPress={() => {
                console.log("항");
              }}
            />
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    backgroundColor: GrayColors.white,
  },
  contents: {
    flex: 1,
    padding: 16,
  },
  guideText: {
    fontFamily: "Pretendard-Medium",
    color: GrayColors.black,
    letterSpacing: -0.4,
  },
  bottomContents: {
    width: "100%",
    paddingTop: 16,
  },
});
