import React, { useState } from "react";
import { StyleSheet, ScrollView, View, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { FontStyle } from "@/constants/Font";
import { MainColors, GrayColors } from "@/constants/Colors";

import Header from "@/components/ui/header";
import LearningStatusCard from "@/components/ui/screen/total/TopTotalContents";
import Divider from "@/components/ui/Divider";
import TodaySummaryContents from "@/components/ui/screen/total/TodaySummaryContents";

export default function ShareScreen() {
  const [accuaryTab, SetAccuaryTab] = useState<boolean>(false);
  const [modeTab, SetModeTab] = useState<boolean>(false);

  return (
    <SafeAreaView style={styles.container}>
      <Header title="통계" />
      <ScrollView showsVerticalScrollIndicator={false} style={styles.contents}>
        <Text style={styles.title}>이번 주 학습 현황</Text>
        <LearningStatusCard />
        <Divider />
        <Text style={styles.title}>전체 학습 통계</Text>
        <TodaySummaryContents
          accuaryTab={accuaryTab}
          SetAccuaryTab={SetAccuaryTab}
          modeTab={modeTab}
          SetModeTab={SetModeTab}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contents: {
    flex: 1,
  },
  title: {
    ...FontStyle.modalTitle,
    color: GrayColors.black,
    marginVertical: 24,
    marginHorizontal: 16,
  },
});
