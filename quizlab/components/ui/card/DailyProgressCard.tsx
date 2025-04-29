import { GrayColors, MainColors } from "@/constants/Colors";
import { FontStyle } from "@/constants/Font";
import { StyleSheet } from "react-native";
import { View, Text, Image } from "react-native";

import Feather from "@expo/vector-icons/Feather";

import CheckCircle from "@/assets/icons/done.png";
import XCircle from "@/assets/icons/yet.png";

import { TotalLearningStats } from "@/utils/cloud/learning";
import { formatToHM } from "@/utils/formatToHM";

type DailyProgressType = {
  isTodayLearned: boolean; // 학습 여부
  currentStreak: number; // 연속 학습
  stats: TotalLearningStats;
};

export default function DailyProgressCard({
  isTodayLearned,
  currentStreak,
  stats,
}: DailyProgressType) {
  return (
    <View style={styles.container}>
      <Text style={styles.listTitle}>학습 통계</Text>
      <View style={styles.todayCardContainer}>
        <View
          style={{
            gap: 4,
          }}
        >
          <Text style={styles.title}>
            {isTodayLearned ? "오늘의 학습 완료!" : "아직 학습 전이에요"}
          </Text>
          {currentStreak !== 0 ? (
            <View
              style={[
                styles.flexRow,
                {
                  gap: 4,
                },
              ]}
            >
              <Text
                style={[
                  styles.subDesTitle,
                  {
                    color: MainColors.primary,
                  },
                ]}
              >
                🔥 {currentStreak}일
              </Text>
              <Text
                style={[
                  styles.subDesTitle,
                  {
                    color: GrayColors.gray30,
                  },
                ]}
              >
                연속 학습 중
              </Text>
            </View>
          ) : (
            <View>
              <Text
                style={[
                  styles.subDesTitle,
                  {
                    color: GrayColors.gray30,
                  },
                ]}
              >
                문제 풀이를 통해 {`\n`}연속 학습 기록을 이어가세요!
              </Text>
            </View>
          )}
        </View>
        <View
          style={[
            styles.checkCircle,
            {
              backgroundColor: isTodayLearned
                ? MainColors.safeSec
                : GrayColors.gray20,
            },
          ]}
        >
          <Image
            source={isTodayLearned ? CheckCircle : XCircle}
            style={{
              width: 64,
              height: 64,
              tintColor: isTodayLearned ? MainColors.safe : GrayColors.gray30,
            }}
          />
        </View>
      </View>
      <Text
        style={{
          ...FontStyle.textBoxLabel,
          color: GrayColors.gray30,
        }}
      >
        오늘의 기록
      </Text>
      <View>
        <View
          style={[
            styles.flexRow,
            {
              gap: 12,
            },
          ]}
        >
          <View style={styles.todayLearnContainer}>
            <View
              style={{
                gap: 4,
              }}
            >
              <Text
                style={[
                  styles.subDesTitle,
                  {
                    color: GrayColors.gray30,
                  },
                ]}
              >
                총 학습 시간
              </Text>
              <Text style={styles.title}>
                {formatToHM(stats.totalDuration)}
              </Text>
            </View>
            <View style={styles.iconCircle}>
              <Feather name="clock" size={24} color={MainColors.primary} />
            </View>
          </View>
          <View style={styles.todayLearnContainer}>
            <View
              style={{
                gap: 4,
              }}
            >
              <Text
                style={[
                  styles.subDesTitle,
                  {
                    color: GrayColors.gray30,
                  },
                ]}
              >
                푼 문제 수
              </Text>
              <Text style={styles.title}>{stats.totalSolvedProblems}개</Text>
            </View>
            <View style={styles.iconCircle}>
              <Feather name="edit-3" size={24} color={MainColors.primary} />
            </View>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 24,
    paddingHorizontal: 16,
    gap: 16,
  },
  title: {
    ...FontStyle.listTitle,
    color: GrayColors.black,
  },

  listTitle: {
    ...FontStyle.modalTitle,
    color: GrayColors.black,
  },
  subDesTitle: {
    ...FontStyle.bedgeText,
  },
  todayCardContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",

    borderRadius: 8,
    borderWidth: 1,
    borderColor: GrayColors.gray20,
    paddingVertical: 16,
    paddingHorizontal: 20,
  },
  checkCircle: {
    justifyContent: "center",
    alignItems: "center",
    height: 80,
    width: 80,
    borderRadius: 1000,
  },
  flexRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  todayLearnContainer: {
    flex: 1,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: GrayColors.gray20,
    padding: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  iconCircle: {
    justifyContent: "center",
    alignItems: "center",
    height: 48,
    width: 48,
    borderRadius: 1000,
    backgroundColor: MainColors.tertiary,
  },
});
