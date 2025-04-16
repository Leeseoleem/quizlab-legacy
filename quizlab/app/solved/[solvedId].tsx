import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  StyleSheet,
  View,
  Text,
  ActivityIndicator,
  FlatList,
} from "react-native";
import { router, useLocalSearchParams } from "expo-router";

import { GrayColors } from "@/constants/Colors";
import { FontStyle } from "@/constants/Font";
import safeParam from "@/utils/params";

import { SolvedFolderDoc, SolvedProblemDoc } from "@/types/solved";
import { getSolvedFolder, getSolvedProblems } from "@/utils/cloud/solved";
import { auth } from "@/lib/firebaseConfig";

import Header from "@/components/ui/header";
import Button from "@/components/ui/button/Button";
import TotalCard from "@/components/ui/card/TotalCard";
import AnswerReviewCard from "@/components/ui/card/AnswerReviewCard";

export default function SolvedScreen() {
  const { solvedId } = useLocalSearchParams();
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
      console.log(problemData);
    };

    fetchData();
  }, [solvedId]);

  if (!solvedData || !solvedProblems) {
    return <ActivityIndicator />;
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.contentWrapper}>
        <FlatList
          data={solvedProblems}
          keyExtractor={(item) => item.problemId}
          renderItem={({ item }) => (
            <View
              style={{
                padding: 16,
              }}
            >
              <AnswerReviewCard
                type={item.type}
                isCorrect={item.isCorrect}
                question={item.question}
                userAnswer={item.userAnswer}
                correctAnswer={item.correctAnswer}
                options={item.options}
              />
            </View>
          )}
          ListHeaderComponent={
            <>
              <Header title="풀이 결과" />
              <View style={styles.innerPadding}>
                <View
                  style={{
                    height: 24,
                  }}
                />
                <TotalCard
                  date={solvedData.date}
                  mode="timed"
                  duration={solvedData.duration}
                  correctCount={solvedData.correctCount}
                  totalCount={solvedData.totalCount}
                  accuracy={solvedData.accuracy}
                />
                <Text style={styles.solvedTitle}>풀이 내역</Text>
              </View>
            </>
          }
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      </View>

      {/* ✅ 하단 고정 버튼 영역 */}
      <View style={styles.bottomContents}>
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
  contentWrapper: {
    flex: 1, // FlatList는 스크롤 영역
  },
  innerPadding: {
    paddingHorizontal: 16,
  },
  listContent: {
    paddingBottom: 24,
  },
  solvedTitle: {
    ...FontStyle.title,
    color: GrayColors.black,
    marginTop: 60,
  },
  problemItem: {
    ...FontStyle.contentsText,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: GrayColors.gray10,
  },
  bottomContents: {
    paddingHorizontal: 16,
    paddingVertical: 20,
  },
});
