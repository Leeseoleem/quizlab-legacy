import { useEffect, useState, useRef } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { StyleSheet, View, Text, ActivityIndicator } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

import { auth } from "@/lib/firebaseConfig";
import { SolvedFolderDoc, SolvedProblemDoc } from "@/types/solved";
import {
  getSolvedFolder,
  getSolvedProblems,
  updateSolvedProblemMemos,
} from "@/utils/cloud/solved";
import safeParam from "@/utils/params";
import { formatSmartDate } from "@/utils/formatDate";
import { SolvedMode } from "@/types/solved";
import { checkFolderHasProblems } from "@/utils/cloud/problems";
import showToast from "@/utils/showToast";
import { generatePDF } from "@/utils/pdf/buildHtmlTemplate";

import { FontStyle } from "@/constants/Font";
import { GrayColors, MainColors } from "@/constants/Colors";

import Header from "@/components/ui/header";
import TotalSummaryCard from "@/components/ui/card/TotalSummaryCard";
import AnswerReviewCard from "@/components/ui/card/AnswerReviewCard";

export default function RecordListScreen() {
  const { solvedId, title, mode, folderId } = useLocalSearchParams();

  const user = auth.currentUser;

  if (!user) {
    console.log("❌ 유저 없음, 중단됨");
    return;
  }

  const userId = user.uid;
  const [solvedData, setSolvedData] = useState<SolvedFolderDoc | null>(null);
  const [solvedProblems, setSolvedProblems] = useState<SolvedProblemDoc[]>([]);

  const fetchDataAndInitMemo = async () => {
    const reviewData = await getSolvedFolder(userId, safeParam(solvedId));
    const problemData = await getSolvedProblems(userId, safeParam(solvedId));
    setSolvedData(reviewData);
    setSolvedProblems(problemData);

    // 🔽 초기 memoMap 설정
    const initialMemoMap: Record<string, string> = {};
    problemData.forEach((item) => {
      initialMemoMap[item.problemId] = item.memoText ?? "";
    });
    setMemoMap(initialMemoMap);
    memoRef.current = initialMemoMap;
  };

  // 문제 내역 불러오기
  useEffect(() => {
    const userId = auth.currentUser?.uid;
    if (!userId || !solvedId) return;

    fetchDataAndInitMemo();
  }, [solvedId]);

  const [memoMap, setMemoMap] = useState<Record<string, string>>({});
  const memoRef = useRef<Record<string, string>>({}); // memoMap 값을 최신 반영

  const handleMemoChange = (problemId: string, text: string) => {
    setMemoMap((prev) => {
      const updated = { ...prev, [problemId]: text };
      memoRef.current = updated;
      return updated;
    });
  };

  // ✅ 화면 이탈 시 자동 저장
  useEffect(() => {
    fetchDataAndInitMemo();
    console.log(solvedProblems);
    return () => {
      if (!userId || !solvedId) return;

      (async () => {
        console.log("📦 저장 전 memoRef:", memoRef.current);
        await updateSolvedProblemMemos(
          userId,
          safeParam(solvedId),
          memoRef.current
        );
      })();
    };
  }, []);

  if (!solvedData || !solvedProblems) {
    return <ActivityIndicator />;
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* 스크롤 가능한 영역 */}
      <KeyboardAwareScrollView
        showsVerticalScrollIndicator={false}
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        enableOnAndroid
        keyboardShouldPersistTaps="handled"
        extraScrollHeight={80}
      >
        <View style={styles.topContents}>
          <Header
            title={safeParam(title)}
            onPressBack={() => router.back()}
            showBack={true}
          />
          <View
            style={{
              paddingHorizontal: 16,
              paddingVertical: 24,
            }}
          >
            <TotalSummaryCard
              date={formatSmartDate(solvedData.startedAt)}
              mode={mode as SolvedMode}
              duration={solvedData.duration}
              correctCount={solvedData.correctCount}
              totalCount={solvedData.totalCount}
              onRetry={async () => {
                const hasProblems = await checkFolderHasProblems(
                  safeParam(folderId)
                );
                if (!hasProblems) {
                  showToast("폴더가 존재하지 않습니다.");
                  return;
                }

                router.push({
                  pathname: "/(tabs)/problem/[folderId]",
                  params: { folderId: safeParam(folderId), title },
                });
              }}
              onSave={async () => {
                try {
                  const filePath = await generatePDF(
                    solvedData,
                    solvedProblems
                  );
                  if (filePath) {
                    console.log("✅ PDF 저장됨:", filePath);
                    showToast("📄 PDF가 저장되었습니다.");
                  } else {
                    showToast("❌ PDF 저장에 실패했습니다.");
                  }
                } catch (err) {
                  console.error("❌ PDF 생성 중 오류:", err);
                  showToast("PDF 생성 중 오류가 발생했습니다.");
                }
              }}
            />
            <Text style={styles.solvedTitle}>풀이 내역</Text>
          </View>
        </View>
        {/* 문제 리스트 */}
        {solvedProblems.map((item) => (
          <View key={item.problemId} style={{ padding: 16 }}>
            <AnswerReviewCard
              type={item.type}
              isCorrect={item.isCorrect}
              question={item.question}
              userAnswer={item.userAnswer}
              correctAnswer={item.correctAnswer}
              options={item.options}
              hasMemo={item.hasMemo ? item.hasMemo : false}
              text={memoMap[item.problemId] || ""}
              onChangetText={(text) => handleMemoChange(item.problemId, text)}
            />
          </View>
        ))}
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scroll: {
    flex: 1,
    backgroundColor: GrayColors.gray10,
  },
  topContents: {
    flex: 1,
    backgroundColor: GrayColors.white,
  },
  scrollContent: {
    paddingBottom: 24,
  },
  innerPadding: {
    paddingHorizontal: 16,
  },
  solvedTitle: {
    ...FontStyle.title,
    color: GrayColors.black,
    marginTop: 60,
  },
  bottomFixed: {
    paddingHorizontal: 16,
    paddingVertical: 20,
  },
});
