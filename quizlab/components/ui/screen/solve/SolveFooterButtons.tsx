import { View, StyleSheet } from "react-native";
import ProblemBtn from "../../button/ProblemBtn";

export type SolveFooterButtonsProps = {
  isFirst: boolean;
  isLast: boolean;
  onPrev: () => void;
  onNext: () => void;
  onSubmit: () => void;
};

export default function SolveFooterButtons({
  isFirst,
  isLast,
  onPrev,
  onNext,
  onSubmit,
}: SolveFooterButtonsProps) {
  return (
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
