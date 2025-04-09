import { View, Text, TouchableOpacity } from "react-native";
import { StyleSheet } from "react-native";

import { GrayColors, MainColors } from "@/constants/Colors";
import { FontStyle } from "@/constants/Font";
import Feather from "@expo/vector-icons/Feather";

import SimpleModalContainer from "../SimpleModalContainer";

type SelectMode = {
  visible: boolean;
  onRequestClose: () => void;
  onTimed: () => void;
  onFree: () => void;
  onReview: () => void;
};

export default function SelectModeModal({
  visible,
  onRequestClose,
  onTimed,
  onFree,
  onReview,
}: SelectMode) {
  return (
    <SimpleModalContainer
      visible={visible}
      onRequestClose={onRequestClose}
      type="back"
      title="모드 선택"
      onPressBack={onRequestClose}
    >
      <View style={styles.container}>
        <ModeSection
          mode="timed"
          modeTitle="시간 제한 모드"
          modeScribe="제한 시간 내에 문제를 풀어보세요"
          onPress={onTimed}
        />
        <View
          style={{
            height: 16,
          }}
        />
        <ModeSection
          mode="free"
          modeTitle="자유 모드"
          modeScribe="자유롭게 문제를 풀어보세요"
          onPress={onFree}
        />
        <View
          style={{
            height: 16,
          }}
        />
        <ModeSection
          mode="review"
          modeTitle="해설 모드"
          modeScribe="정답을 확인하며 문제를 풀어보세요"
          onPress={onReview}
        />
      </View>
    </SimpleModalContainer>
  );
}

type ModeProps = {
  mode: "timed" | "free" | "review";
  modeTitle: string;
  modeScribe: string;
  onPress: () => void;
};

const ModeSection = ({ mode, modeTitle, modeScribe, onPress }: ModeProps) => {
  return (
    <TouchableOpacity
      style={styles.modeContainer}
      activeOpacity={0.8}
      onPress={onPress}
    >
      {mode === "timed" && (
        <Feather name="clock" size={24} color={MainColors.primary} />
      )}
      {mode === "free" && (
        <Feather name="play" size={24} color={MainColors.primary} />
      )}
      {mode === "review" && (
        <Feather name="edit-3" size={24} color={MainColors.primary} />
      )}
      <View style={styles.modeText}>
        <Text style={styles.modeTitle}>{modeTitle}</Text>
        <Text style={styles.modeScribe}>{modeScribe}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "column",
  },
  modeContainer: {
    width: "100%",
    flexDirection: "row",
    padding: 16,
    borderRadius: 10,
    alignItems: "center",
    borderWidth: 1,
    borderColor: GrayColors.gray20,
  },
  modeText: {
    marginLeft: 20,
  },
  modeTitle: {
    ...FontStyle.subTitle,
    color: GrayColors.black,
    marginBottom: 4,
  },
  modeScribe: {
    ...FontStyle.bedgeText,
    color: GrayColors.gray30,
  },
});
