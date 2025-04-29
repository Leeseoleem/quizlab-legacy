import React, { useState, useRef, useEffect, useCallback } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { ActivityIndicator, StyleSheet } from "react-native";
import { View, Text, FlatList, ScrollView } from "react-native";
import { useLocalSearchParams, router } from "expo-router";

import safeParam from "@/utils/params";
import { GrayColors, MainColors } from "@/constants/Colors";

import {
  createProblem,
  getUserProblems,
  updateProblem,
  deleteProblem,
} from "@/utils/cloud/problems";
import { ProblemList } from "@/utils/problemOptionsHandler/problemOptionHandlers";
import { checkAuthAndRedirect } from "@/utils/firebase/checkUser";
import { ProblemType, SolvedMode } from "@/types/problems";

import Header from "@/components/ui/header";
import ProblemDetailList from "@/components/ui/list/ProblemDetailList";
import Button from "@/components/ui/button/Button";
import CreateProblemModal from "@/components/ui/modal/screenModal/CreateProblemModal";
import { MyType } from "@/components/ui/modal/screenModal/CreateProblemModal";
import BottomModal, {
  BottomModalRef,
} from "@/components/ui/bottoModal/BottomModal";

import showToast from "@/utils/showToast";
import {
  EditDesProblemModal,
  EditChoiceProblemModal,
} from "@/components/ui/modal/screenModal/EditProblemModal";
import SelectModeModal from "@/components/ui/modal/screenModal/SelectModeModal";
import SettingTimeModal from "@/components/ui/modal/screenModal/SettingTimeModal";

// 고유 id 생성
const generateId = () => `${Date.now()}-${Math.random()}`;

export default function FolderDetailScreen() {
  const { folderId, title } = useLocalSearchParams();

  const user = checkAuthAndRedirect(); // 유저 로그인 여부 체크

  const [isLoading, setIsLoading] = useState(true);
  const [problemListData, setProblemListData] = useState<ProblemType[]>([]);

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
  const scrollRef = useRef<ScrollView>(null); // tab 화면
  const scrollViewRef = useRef<ScrollView>(null); // 선택형 문제 생성

  // 선택형
  const [options, setOptions] = useState<ProblemList[]>([
    { id: generateId(), text: "", isCorrect: false },
    { id: generateId(), text: "", isCorrect: false },
  ]);

  // 문제 생성
  const handelCreateProblem = async () => {
    if (!user) return;

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
          showToast("정답은 필수 1개 선택되어야 합니다");
          return; // 저장 막기
        }

        const hasBlankText = options.some((opt) => opt.text.trim() === "");
        if (hasBlankText || problemText.trim() === "") {
          showToast("내용이 모두 작성되지 않았습니다");
          return; // 저장 막기
        }

        const problem = {
          type: type,
          folderId: folderId as string,
          question: problemText,
          options: options.map(({ text, isCorrect }) => ({
            id: generateId(),
            text,
            isCorrect,
          })),
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

  // 문제 수정-삭제
  const bottomModalRef = useRef<BottomModalRef>(null);

  const [selectProblem, setSelectProblem] = useState<ProblemType>();
  // 서술형 문제 모달
  const [openEditDesModal, setOpenEditDesModal] = useState(false);
  // 선택형 문제 모달
  const [openEditChoiceModal, setOpenEditChoiceModal] = useState(false);
  const [editProblemText, setEditProblemText] = useState("");
  const [editAnswerText, setEditAnswerText] = useState("");

  const [EditOptions, setEditOptions] = useState<ProblemList[]>([]);

  const handleOpenModal = (problem: ProblemType) => {
    bottomModalRef.current?.open();
    setEditList(problem);
  };

  const setEditList = (problem: ProblemType) => {
    setSelectProblem(problem); // 현재 선택한 폴더 정보 저장
    setEditProblemText(problem.question); // 문제 저장
    if (problem.type === "descriptive") {
      setType("descriptive"); // 타입- 서술형
      setEditAnswerText(problem.answer); // 정답
    } else if (problem.type === "choice") {
      setType("choice");
      console.log(problem.options);
      setEditOptions(
        problem.options.map(({ text, isCorrect }) => ({
          id: generateId(),
          text,
          isCorrect,
        }))
      ); // 정답 리스트
    }
  };

  // 수정하기 버튼
  const handelEdit = () => {
    bottomModalRef.current?.close();

    setTimeout(() => {
      if (selectProblem?.type === "descriptive") {
        setOpenEditDesModal(true);
      } else if (selectProblem?.type === "choice") {
        setOpenEditChoiceModal(true);
      }
    }, 300); // BottomSheet 애니메이션 종료 시간 고려
  };

  // 서술형 문제 수정 함수
  const handleEditDes = async () => {
    setType("descriptive"); // 타입- 서술형

    if (!user) return;

    if (!selectProblem?.id) {
      showToast("다시 선택해주세요");
      handleEditProblem();
      return;
    }

    try {
      const updatedData = {
        question: editProblemText,
        answer: editAnswerText,
      };
      await updateProblem(selectProblem?.id, updatedData);

      await fetchProblems();
      handleEditProblem();
    } catch (e) {
      showToast("수정이 완료되지 않았습니다");
    }
  };

  // 선택형 문제 수정 함수
  const handleEditChoice = async () => {
    setType("choice"); // 타입- 서술형

    if (!user) return;

    if (!selectProblem?.id) {
      showToast("다시 선택해주세요");
      handleEditProblem();
      return;
    }

    try {
      const updatedData = {
        question: editProblemText,
        options: EditOptions.map(({ text, isCorrect }) => ({
          text,
          isCorrect,
        })),
      };
      await updateProblem(selectProblem?.id, updatedData);

      await fetchProblems();
      handleEditProblem();

      showToast("문제가 수정되었습니다");
    } catch (e) {
      showToast("수정이 완료되지 않았습니다");
    }
  };

  // 수정 초기화
  const handleEditProblem = () => {
    setEditProblemText("");
    if (selectProblem?.type === "descriptive") {
      setAnswerText("");
      setOpenEditDesModal(false);
    } else if (selectProblem?.type === "choice") {
      setOpenEditChoiceModal(false);
    }
    setSelectProblem(undefined);
    setType("descriptive");
  };

  const handelDeleteFolder = async () => {
    try {
      if (!user) return;

      if (!selectProblem?.id) {
        showToast("다시 선택해주세요");
        handleEditProblem();
        return;
      }

      await deleteProblem(selectProblem.id);

      bottomModalRef.current?.close();
      showToast("문제가 삭제되었습니다");

      await fetchProblems();
      handleEditProblem();
    } catch (e) {
      showToast("오류가 발생했습니다");
    }
  };

  // 문제 풀이 모드 선택
  const [openSelectMode, setOpenSelectMode] = useState(false);

  // 시간 모드: 시간 선택
  const [openTimed, setOpenTimed] = useState(false);

  // 시간 인덱스
  const [hour, setHour] = useState(0);
  const [minute, setMinute] = useState(0);

  const hourFlatListRef = useRef<FlatList>(null);
  const minuteFlatList = useRef<FlatList>(null);

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
        option={options}
        setOptions={setOptions}
        scrollListRef={scrollViewRef}
      />
      <EditDesProblemModal
        visible={openEditDesModal}
        onRequestClose={() => {
          setOpenEditDesModal(false);
          handleEditProblem();
        }}
        onEditDes={() => handleEditDes()}
        editProblemText={editProblemText}
        setEditProblemText={setEditProblemText}
        editAnswerText={editAnswerText}
        setEditAnswerText={setEditAnswerText}
      />
      <EditChoiceProblemModal
        visible={openEditChoiceModal}
        onRequestClose={() => {
          setOpenEditChoiceModal(false);
          handleEditProblem();
        }}
        onEditChoice={() => {
          handleEditChoice();
        }}
        problemText={editProblemText}
        setProblemText={setEditProblemText}
        option={EditOptions}
        setOptions={setEditOptions}
        scrollListRef={scrollViewRef}
      />
      <SelectModeModal
        visible={openSelectMode}
        onRequestClose={() => setOpenSelectMode(false)}
        onTimed={() => {
          setOpenSelectMode(false);
          setOpenTimed(true);
        }}
        onFree={() => {
          router.push({
            pathname: "/(solve)/free/[folderId]",
            params: {
              folderId: safeParam(folderId),
              title: title,
              mode: "free",
            },
          });
        }}
        onReview={() => {
          router.push({
            pathname: "/(solve)/review/[folderId]",
            params: {
              folderId: safeParam(folderId),
              title: title,
              mode: "free",
            },
          });
        }}
      />
      <SettingTimeModal
        visible={openTimed}
        onRequestClose={() => setOpenTimed(false)}
        onPressExist={() => {
          setOpenTimed(false);
          setOpenSelectMode(true);
        }}
        onStart={() => {
          if (minute === 0 && hour === 0) {
            showToast("시간을 설정해주세요");
            return;
          }
          console.log(hour, " 시간", minute, " 분");
          router.push({
            pathname: "/(solve)/timed/[folderId]",
            params: {
              folderId: safeParam(folderId),
              title: title,
              mode: "timed",
              hour: String(hour), // 예: "1"
              minute: String(minute), // 예: "30"
            },
          });
        }}
        selectHourIndex={hour}
        hourFlatListRef={hourFlatListRef}
        onHourChange={(index) => setHour(index)}
        selectMinutesIndex={minute}
        minuteFlatList={minuteFlatList}
        onMinutesChange={(index) => setMinute(index)}
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
                  onEditProblem={() => handleOpenModal(item)}
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
              type={problemListData.length ? "default" : "non"}
              btnTitle="문제 풀기"
              onPress={() => {
                setOpenSelectMode(true);
              }}
            />
          </View>
        </View>
      </View>
      <BottomModal
        ref={bottomModalRef}
        title={"문제 수정"}
        onEdit={handelEdit}
        onDelete={handelDeleteFolder}
      />
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
    textAlign: "center",
  },
  bottomContents: {
    width: "100%",
    paddingTop: 16,
  },
});
