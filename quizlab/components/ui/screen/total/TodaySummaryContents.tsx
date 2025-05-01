import { useState, useCallback } from "react";
import { useFocusEffect } from "@react-navigation/native";
import { StyleSheet, View, Text } from "react-native";

import { FontStyle } from "@/constants/Font";
import { GrayColors, MainColors } from "@/constants/Colors";
import Feather from "@expo/vector-icons/Feather";

import {
  TotalLearningStats,
  getTotalLearningStats,
} from "@/utils/cloud/learning";
import { formatToHM } from "@/utils/formatToHM";

import LearnContainer from "../../card/LearnContainer";
import SummaryTabCard, { SummaryTabCardProps } from "./SummaryTabCard";

export default function TodaySummaryContents({
  accuaryTab,
  SetAccuaryTab,
  modeTab,
  SetModeTab,
}: SummaryTabCardProps) {
  // 총 학습 시간 / 푼 문제 수
  const [stats, setStats] = useState<TotalLearningStats | null>(null);

  // 총합 기록
  const fetchStats = async () => {
    const result = await getTotalLearningStats(); // or getTotalLearningStats / getFolderLearningStats("abc")
    if (result) setStats(result);
  };

  useFocusEffect(
    useCallback(() => {
      fetchStats();
    }, [])
  );

  return (
    <View style={styles.container}>
      <View style={styles.topContents}>
        <LearnContainer
          keyTitle="총 학습 시간"
          value={
            stats?.totalSolvedProblems !== undefined
              ? formatToHM(stats?.totalDuration)
              : "로딩중"
          }
          icon={<Feather name="clock" size={24} color={MainColors.primary} />}
        />
        <LearnContainer
          keyTitle="푼 문제 수"
          value={
            stats?.totalSolvedProblems !== undefined
              ? `${stats.totalSolvedProblems}개`
              : "로딩중"
          }
          icon={<Feather name="edit-3" size={24} color={MainColors.primary} />}
        />
      </View>
      <SummaryTabCard
        accuaryTab={accuaryTab}
        SetAccuaryTab={SetAccuaryTab}
        modeTab={modeTab}
        SetModeTab={SetModeTab}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 12,
    paddingHorizontal: 16,
  },

  topContents: {
    flexDirection: "row",
    gap: 12,
  },
});
