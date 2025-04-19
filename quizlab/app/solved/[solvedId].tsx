import React, { useEffect, useState, useRef } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { StyleSheet, View, Text, ActivityIndicator } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { router, useLocalSearchParams } from "expo-router";

import { GrayColors } from "@/constants/Colors";
import { FontStyle } from "@/constants/Font";
import safeParam from "@/utils/params";

import { SolvedFolderDoc, SolvedMode, SolvedProblemDoc } from "@/types/solved";
import {
  getSolvedFolder,
  getSolvedProblems,
  updateSolvedProblemMemos,
} from "@/utils/cloud/solved";
import { auth } from "@/lib/firebaseConfig";

import Header from "@/components/ui/header";
import Button from "@/components/ui/button/Button";
import TotalCard from "@/components/ui/card/TotalCard";
import AnswerReviewCard from "@/components/ui/card/AnswerReviewCard";

export default function SolvedScreen() {
  const { solvedId, mode } = useLocalSearchParams();
  const userId = auth.currentUser?.uid;

  const [solvedData, setSolvedData] = useState<SolvedFolderDoc | null>(null);
  const [solvedProblems, setSolvedProblems] = useState<SolvedProblemDoc[]>([]);

  useEffect(() => {
    if (!userId || !solvedId) return;
    const fetchData = async () => {
      const data = await getSolvedFolder(userId, safeParam(solvedId));
      const problemData = await getSolvedProblems(userId, safeParam(solvedId));
      setSolvedData(data);
      setSolvedProblems(problemData);
    };
    console.log(mode);

    fetchData();
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
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        enableOnAndroid
        keyboardShouldPersistTaps="handled"
        extraScrollHeight={250}
      >
        <Header title="풀이 결과" />
        <View style={styles.innerPadding}>
          <View style={{ height: 24 }} />
          <TotalCard
            date={solvedData.date}
            mode={mode as SolvedMode}
            duration={solvedData.duration}
            correctCount={solvedData.correctCount}
            totalCount={solvedData.totalCount}
            accuracy={solvedData.accuracy}
          />
          <Text style={styles.solvedTitle}>풀이 내역</Text>
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
              text={memoMap[item.problemId] || ""}
              onChangetText={(text) => handleMemoChange(item.problemId, text)}
            />
          </View>
        ))}
      </KeyboardAwareScrollView>

      {/* 하단 고정 버튼 */}
      <View style={styles.bottomFixed}>
        <Button
          type="other"
          onPress={() => router.replace("/(tabs)/record")}
          btnTitle="기록 확인하기"
        />
        <View style={{ height: 16 }} />
        <Button
          type="default"
          onPress={() => router.replace("/(tabs)/problem")}
          btnTitle="문제 목록으로"
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scroll: {
    flex: 1,
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
