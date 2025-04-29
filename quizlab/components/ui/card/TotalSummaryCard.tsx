import { ReactElement, useEffect, useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { StyleSheet } from "react-native";

import { GrayColors, MainColors } from "@/constants/Colors";
import { FontStyle } from "@/constants/Font";

import { SolvedMode } from "@/types/solved";
import { formatDuration } from "@/utils/formatDuration";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import Feather from "@expo/vector-icons/Feather";

type TotalSummaryProps = {
  date: string;
  mode: SolvedMode;
  duration: number;
  correctCount: number;
  totalCount: number;

  onSave: () => void;
  onRetry: () => void;
};

export default function TotalSummaryCard({
  date,
  mode,
  duration,
  correctCount,
  totalCount,
  onSave,
  onRetry,
}: TotalSummaryProps) {
  // 모드 이름 설정
  const [modeName, setModeName] = useState("");

  useEffect(() => {
    switch (mode) {
      case "timed":
        setModeName("시간 제한 모드");
        break;
      case "free":
        setModeName(" 자유 모드");
        break;
      case "review":
        setModeName("해설 모드");
        break;
    }
  }, [mode]);

  let count = `${correctCount} / ${totalCount}`;

  return (
    <View style={totalStyles.totalContainer}>
      <View>
        <View style={totalStyles.header}>
          <Text style={totalStyles.title}>학습 요약</Text>
          <Text style={totalStyles.date}>{date}</Text>
        </View>
      </View>
      <View style={totalStyles.contents}>
        <View style={totalStyles.subContents}>
          <TotalList
            label="풀이 모드"
            value={modeName}
            icon={<FontAwesome name="pencil" size={16} color="black" />}
          />

          <TotalList
            label="걸린 시간"
            value={formatDuration(duration)}
            icon={
              <FontAwesome
                name="clock-o"
                size={16}
                color={MainColors.primary}
              />
            }
          />
          <TotalList
            label="맞은 문제"
            value={count}
            icon={
              <FontAwesome
                name="check-square"
                size={16}
                color={MainColors.safe}
              />
            }
          />
        </View>
        <View style={totalStyles.botomContents}>
          <CardBtn title="다시 풀기" btnType="line" onPress={onRetry} />
          <CardBtn
            title="PDF 저장하기"
            btnType="main"
            onPress={onSave}
            icon={
              <Feather name="download" size={24} color={GrayColors.white} />
            }
          />
        </View>
      </View>
    </View>
  );
}

const totalStyles = StyleSheet.create({
  totalContainer: {
    borderRadius: 8,
    borderWidth: 1,
    borderColor: GrayColors.gray20,
  },
  header: {
    alignItems: "center",
    paddingTop: 32,
    paddingBottom: 12,
    paddingHorizontal: 20,
  },
  title: {
    ...FontStyle.boldTitle,
    color: GrayColors.black,
    textAlign: "center",
    marginBottom: 12,
  },
  date: {
    ...FontStyle.bedgeText,
    color: GrayColors.gray30,
    letterSpacing: -0.2,
  },
  contents: {
    backgroundColor: MainColors.primaryForeground,
  },
  subContents: {
    flex: 1,
    paddingVertical: 24,
  },
  botomContents: {
    padding: 24,
    paddingTop: 12,
    gap: 16,
    width: "100%",
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
  },
});

type Listprops = {
  icon: ReactElement;
  label: string;
  value: string | number;
};

const TotalList = ({ icon, label, value }: Listprops) => {
  return (
    <View style={listStyles.container}>
      <View style={listStyles.labelContainer}>
        <View style={listStyles.iconLine}>{icon}</View>
        <Text style={listStyles.label}>{label}</Text>
      </View>
      <Text style={listStyles.value}>{value}</Text>
    </View>
  );
};

const listStyles = StyleSheet.create({
  container: {
    paddingHorizontal: 24,
    paddingVertical: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  labelContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  iconLine: {
    alignItems: "center",
    justifyContent: "center",
  },
  label: {
    ...FontStyle.contentsText,
    color: GrayColors.gray40,
  },
  value: {
    ...FontStyle.subTitle,
    color: GrayColors.gray40,
  },
});

type btnProp = {
  icon?: ReactElement;
  btnType: "main" | "line";
  title: string;
  onPress: () => void;
};

const CardBtn = ({ icon, btnType, title, onPress }: btnProp) => {
  return (
    <View>
      <TouchableOpacity
        activeOpacity={0.8}
        style={[
          styles.btnContainer,
          {
            backgroundColor:
              btnType === "main" ? MainColors.primary : GrayColors.white,
            borderWidth: btnType === "line" ? 1.5 : undefined,
            borderColor: btnType === "line" ? MainColors.primary : undefined,
          },
        ]}
        onPress={onPress}
      >
        {icon}
        <Text
          style={{
            ...styles.title,
            color: btnType === "main" ? GrayColors.white : MainColors.primary,
          }}
        >
          {title}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  btnContainer: {
    flexDirection: "row",
    gap: 12,
    paddingHorizontal: 24,
    height: 48,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 12,
  },
  title: {
    ...FontStyle.subTitle,
  },
});
