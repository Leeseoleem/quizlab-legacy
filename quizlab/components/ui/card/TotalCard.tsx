import { useEffect, useState } from "react";
import { View, Text } from "react-native";
import { StyleSheet } from "react-native";
import { AnimatedCircularProgress } from "react-native-circular-progress";

import { GrayColors, MainColors } from "@/constants/Colors";
import { FontStyle } from "@/constants/Font";

import { SolvedMode } from "@/types/solved";
import { formatDuration } from "@/utils/formatDuration";

export type TotalProps = {
  date: string;
  mode: SolvedMode;
  duration: number;
  correctCount: number;
  totalCount: number;
  accuracy: number;
};

export default function TotalCard({
  date,
  mode,
  duration,
  correctCount,
  totalCount,
  accuracy,
}: TotalProps) {
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

  const getColorByAccuracy = (percent: number) => {
    if (percent >= 70) return MainColors.safe; // 초록
    if (percent >= 30) return "#FF8A3D"; // 주황
    return MainColors.danger; // 빨강
  };

  return (
    <View style={totalStyles.totalContainer}>
      <View>
        <View style={totalStyles.header}>
          <Text style={totalStyles.title}>학습 결과</Text>
          <Text style={totalStyles.date}>📅 {date}</Text>
        </View>
        <View style={totalStyles.mainContents}>
          <View style={totalStyles.content}>
            <Text style={totalStyles.contentTitle}>맞은 문제</Text>
            <View
              style={{
                flex: 1,
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "baseline",
              }}
            >
              <Text
                style={[
                  totalStyles.correctCount,
                  {
                    color: getColorByAccuracy(accuracy),
                  },
                ]}
              >
                {correctCount}
              </Text>
              <Text style={totalStyles.otherCount}> / </Text>
              <Text style={totalStyles.otherCount}>{totalCount}</Text>
            </View>
          </View>
          <View
            style={{
              width: 1,
              backgroundColor: GrayColors.grayHax,
            }}
          />
          <View style={totalStyles.content}>
            <Text style={totalStyles.contentTitle}>정확도</Text>
            <AnimatedCircularProgress
              size={100} // 원 전체 크기
              width={12} // 원 두께
              fill={accuracy} // 퍼센트 (0~100)
              tintColor={getColorByAccuracy(accuracy)} // 진행된 부분 색상
              backgroundColor={GrayColors.gray20} // 남은 부분 배경 색
              lineCap="round"
              rotation={0}
            >
              {(fill) => (
                <Text
                  style={{
                    ...FontStyle.boldTitle,
                    color: getColorByAccuracy(accuracy),
                  }}
                >{`${Math.round(fill)}%`}</Text>
              )}
            </AnimatedCircularProgress>
          </View>
        </View>
      </View>
      <View style={totalStyles.subContents}>
        <TotalList label="📝 풀이 모드" value={modeName} />
        <TotalList label="🕒 걸린 시간" value={formatDuration(duration)} />
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
    paddingVertical: 24,
    alignItems: "center",
  },
  title: {
    ...FontStyle.boldTitle,
    color: GrayColors.black,
    textAlign: "center",
    marginBottom: 12,
  },
  date: {
    ...FontStyle.contentsText,
    color: GrayColors.gray30,
    letterSpacing: -0.2,
  },
  mainContents: {
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: "#FEF9F6",
    paddingVertical: 32,
  },
  content: {
    flex: 1,
    alignItems: "center",
  },
  contentTitle: {
    ...FontStyle.contentsText,
    color: GrayColors.gray40,
    marginBottom: 16,
  },
  correctCount: {
    fontSize: 50,
    fontFamily: "Pretendard-Bold",
  },
  otherCount: {
    ...FontStyle.title,
    color: GrayColors.grayHax,
  },
  subContents: {
    paddingVertical: 24,
  },
});

type Listprops = {
  label: string;
  value: string | number;
};

const TotalList = ({ label, value }: Listprops) => {
  return (
    <View style={listStyles.container}>
      <Text style={listStyles.label}>{label}</Text>
      <Text style={listStyles.value}>{value}</Text>
    </View>
  );
};

const listStyles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  label: {
    ...FontStyle.contentsText,
    color: GrayColors.gray30,
  },
  value: {
    ...FontStyle.subTitle,
    color: GrayColors.black,
  },
});
