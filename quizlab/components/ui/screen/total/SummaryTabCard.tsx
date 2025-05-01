import React, { useState, useCallback } from "react";
import { useFocusEffect } from "@react-navigation/native";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Dimensions,
} from "react-native";

import { AnimatedCircularProgress } from "react-native-circular-progress";
import { BarChart } from "react-native-chart-kit";

import { FontStyle } from "@/constants/Font";
import { GrayColors, MainColors } from "@/constants/Colors";

import PercentList from "../../list/PercentList";

export type SummaryTabCardProps = {
  accuaryTab: boolean;
  SetAccuaryTab: React.Dispatch<React.SetStateAction<boolean>>;
  modeTab: boolean;
  SetModeTab: React.Dispatch<React.SetStateAction<boolean>>;
  accuracy: number;
  timed: number;
  free: number;
  review: number;
};

export default function SummaryTabCard({
  accuaryTab,
  SetAccuaryTab,
  modeTab,
  SetModeTab,
  accuracy,
  timed,
  free,
  review,
}: SummaryTabCardProps) {
  const screenWidth = Dimensions.get("window").width;

  const barData = {
    labels: ["시간 제한", "자유", "풀이"],
    datasets: [
      {
        data: [timed, free, review],
      },
    ],
  };
  return (
    <View style={styles.container}>
      <View style={styles.tabHeader}>
        <TabHeader
          title="정확도"
          focus={accuaryTab}
          onPress={() => {
            SetAccuaryTab(true);
            SetModeTab(false);
          }}
        />
        <TabHeader
          title="풀이 방식"
          focus={modeTab}
          onPress={() => {
            SetAccuaryTab(false);
            SetModeTab(true);
          }}
        />
      </View>
      {accuaryTab && (
        <View style={styles.section}>
          <AnimatedCircularProgress
            size={120} // 원 전체 크기
            width={16} // 원 두께
            fill={accuracy} // 퍼센트 (0~100)
            tintColor={MainColors.safe} // 진행된 부분 색상
            backgroundColor={GrayColors.gray20} // 남은 부분 배경 색
            lineCap="round"
            rotation={0}
          >
            {(fill) => (
              <Text
                style={{
                  ...FontStyle.boldTitle,
                  color: MainColors.safe,
                }}
              >{`${Math.round(fill)}%`}</Text>
            )}
          </AnimatedCircularProgress>
          <View style={styles.listSec}>
            <PercentList
              title="Correct"
              value={`${accuracy}%`}
              color={MainColors.safe}
            />
            <PercentList
              title="Incorrect"
              value={`${100 - accuracy}%`}
              color={GrayColors.gray20}
            />
          </View>
        </View>
      )}
      {modeTab && (
        <View style={styles.section}>
          <BarChart
            data={barData}
            width={screenWidth - 64} // 화면 너비 - 여백
            height={220}
            fromZero={true}
            showValuesOnTopOfBars={true}
            yAxisLabel=""
            yAxisSuffix=""
            chartConfig={{
              backgroundColor: GrayColors.white,
              backgroundGradientFrom: GrayColors.white,
              backgroundGradientTo: GrayColors.white,
              decimalPlaces: 0,
              color: (opacity = 1) => `rgba(255, 102, 0, ${opacity})`,
              labelColor: () => GrayColors.gray30,
              style: {
                borderRadius: 16,
              },
            }}
            style={{ marginVertical: 8, borderRadius: 16 }}
          />
          <View style={styles.listSec}>
            <PercentList
              title="시간 제한"
              value={`${timed} 번`}
              color={MainColors.primary}
            />
            <PercentList
              title="자유 모드"
              value={`${free} 번`}
              color={MainColors.primary}
            />
            <PercentList
              title="풀이 모드"
              value={`${review} 번`}
              color={MainColors.primary}
            />
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 8,
    borderWidth: 1,
    borderColor: GrayColors.gray20,
    justifyContent: "space-between",
    alignItems: "center",
  },

  tabHeader: {
    flexDirection: "row",
    width: "100%",
  },
  section: {
    paddingVertical: 24,
    alignItems: "center",
    gap: 24,
  },
  listSec: {
    paddingHorizontal: 24,
  },
});

const TabHeader = ({
  title,
  onPress,
  focus,
}: {
  title: string;
  onPress: () => void;
  focus: boolean;
}) => {
  return (
    <TouchableOpacity
      style={[tabStyles.container]}
      activeOpacity={0.8}
      onPress={onPress}
    >
      <Text
        style={[
          tabStyles.title,
          {
            color: focus ? MainColors.primary : GrayColors.gray20,
          },
        ]}
      >
        {title}
      </Text>
      <View
        style={[
          tabStyles.tabLine,
          {
            backgroundColor: focus ? MainColors.primary : GrayColors.gray20,
          },
        ]}
      />
    </TouchableOpacity>
  );
};

const tabStyles = StyleSheet.create({
  container: {
    flex: 1,
    height: 46,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "flex-end",
  },
  title: {
    ...FontStyle.textBoxLabel,
  },
  tabLine: {
    width: "100%",
    height: 2,
    marginTop: 4,
  },
});
