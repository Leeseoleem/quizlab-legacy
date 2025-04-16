import { View, Text, StyleSheet, ActivityIndicator } from "react-native";
import ProblemBtn from "../../button/ProblemBtn";

import { GrayColors, MainColors } from "@/constants/Colors";
import { FontStyle } from "@/constants/Font";

export type SolveFooterButtonsProps = {
  isFirst: boolean; // {currentIndex === 0}
  isLast: boolean; // {currentIndex === problems.length - 1}
  isSubmitting: boolean;
  onPrev: () => void;
  onNext: () => void;
  onSubmit: () => void;
};

export default function SolveFooterButtons({
  isFirst,
  isLast,
  isSubmitting,
  onPrev,
  onNext,
  onSubmit,
}: SolveFooterButtonsProps) {
  return isSubmitting ? (
    <View style={styles.footer}>
      <ActivityIndicator size="large" color={MainColors.primary} />
      <Text
        style={{
          ...FontStyle.contentsText,
          color: GrayColors.black,
        }}
      >
        제출 중
      </Text>
    </View>
  ) : (
    <View style={styles.footer}>
      <ProblemBtn
        type={isFirst ? "prev-non" : "prev"}
        title="이전"
        onPress={onPrev}
        disabled={isFirst}
      />
      <ProblemBtn
        type={isLast ? "done" : "next"}
        title={isLast ? "제출하기" : "다음"}
        onPress={isLast ? onSubmit : onNext}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  footer: {
    padding: 16,
    flexDirection: "row",
    justifyContent: "space-between",
  },
});
