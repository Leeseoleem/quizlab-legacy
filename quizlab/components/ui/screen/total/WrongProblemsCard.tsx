import { StyleSheet, View, Text } from "react-native";
import { ProgressBar } from "react-native-paper";

import { FontStyle } from "@/constants/Font";
import { GrayColors, MainColors } from "@/constants/Colors";

import { WrongProblemSummary } from "@/utils/cloud/solved";

type wrongProblemsProps = {
  index: number;
  item: WrongProblemSummary;
};

export default function WrongProblemsCard({ index, item }: wrongProblemsProps) {
  return (
    <View style={styles.card}>
      <View>
        <Text style={styles.rank}>Top {index + 1}</Text>
        <Text style={styles.question}>{item.question}</Text>
      </View>

      <View>
        <Text style={styles.label}>정답</Text>
        <Text style={styles.answer}>{item.correctAnswer}</Text>
      </View>

      <View>
        <Text style={styles.barValue}>총 시도: {item.totalCount}회</Text>
        <Text style={styles.barValue}>오답: {item.wrongCount}회</Text>
      </View>

      <View>
        <View style={styles.barHeader}>
          <Text style={styles.label}>오답률</Text>
          <Text style={styles.barValue}>
            {Math.round(item.wrongRate * 100)}%
          </Text>
        </View>
        <ProgressBar
          progress={item.wrongRate}
          color={MainColors.primary}
          style={styles.progressBar}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: GrayColors.white,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: GrayColors.gray20,
    padding: 16,
    gap: 24,
  },
  rank: {
    ...FontStyle.subTitle,
    color: GrayColors.black,
  },
  question: {
    ...FontStyle.modalTitle,
    color: GrayColors.black,
  },
  label: {
    ...FontStyle.bedgeText,
    color: GrayColors.gray30,
  },
  answer: { ...FontStyle.contentsText, color: GrayColors.black },
  stats: {
    fontSize: 12,
    marginBottom: 2,
  },
  barHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
  },

  barValue: {
    ...FontStyle.bedgeText,
    color: GrayColors.black,
  },
  progressBar: {
    height: 8,
    borderRadius: 4,
    marginTop: 4,
  },
});
