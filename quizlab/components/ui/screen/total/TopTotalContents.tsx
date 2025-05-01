import { useState, useEffect, useCallback } from "react";
import { useFocusEffect } from "expo-router";
import { StyleSheet } from "react-native";
import { View, Text } from "react-native";

import { FontStyle } from "@/constants/Font";
import { GrayColors, MainColors } from "@/constants/Colors";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import Ionicons from "@expo/vector-icons/Ionicons";

import { UserLearningInfo, getUserLearningInfo } from "@/utils/cloud/learning";
import {
  getUserLearningRecord,
  AttendanceStatus,
  UserLearningRecord,
} from "@/utils/cloud/learning";
import { todayDate } from "@/utils/cloud/learning";
import CheckDay from "./CheckDay";

export default function LearningStatusCard() {
  // 연속 학습 기록
  const [streakInfo, setStreakInfo] = useState<UserLearningInfo | null>(null);
  const [learningRecord, setLearningRecord] = useState<UserLearningRecord>();

  // 연속 정보 저장
  const fetchStreakInfo = async () => {
    const info = await getUserLearningInfo();
    if (info) {
      setStreakInfo(info); // 받아온 정보를 상태에 저장
    }
  };

  // 일주일 학습 여부 저장
  const fetchLearningRecord = async () => {
    const data = await getUserLearningRecord();
    if (data) setLearningRecord(data);
  };

  useFocusEffect(
    useCallback(() => {
      fetchStreakInfo();
      fetchLearningRecord();
    }, [])
  );

  const date = todayDate(); // 현재 날짜

  const [isTodayLearned, setIsTodayLearned] = useState<boolean>(false);

  useEffect(() => {
    if (streakInfo?.lastLearnedDate === date) {
      setIsTodayLearned(true);
    } else {
      setIsTodayLearned(false);
    }
  }, [streakInfo, date]);

  return (
    <View style={styles.container}>
      <View>
        {streakInfo && streakInfo?.currentStreak > 1 ? (
          <View style={styles.statusContents}>
            <FontAwesome6 name="fire" size={64} color={MainColors.primary} />
            <Text style={styles.desText}>
              {streakInfo?.currentStreak}일 연속 학습 진행 중!
            </Text>
          </View>
        ) : (
          <View style={styles.statusContents}>
            <Ionicons name="sparkles" size={64} color="#FFA500" />
            <Text style={[styles.desText_absent]}>
              오늘부터 꾸준히!{`\n`}연속 기록을 시작해보세요.
            </Text>
          </View>
        )}
      </View>
      <View style={styles.learningStatusBar}>
        {learningRecord?.recordList.map((record, idx) => {
          return (
            <View key={record.day}>
              <CheckDay
                status={record.status}
                day={record.day as AttendanceStatus}
              />
            </View>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 24,
    gap: 24,
  },

  statusContents: {
    justifyContent: "center",
    alignItems: "center",
    gap: 16,
  },
  checkIcon: {
    fontSize: 64,
  },
  desText: {
    ...FontStyle.title,
    color: MainColors.primary,
  },
  desText_absent: {
    ...FontStyle.modalTitle,
    textAlign: "center",
    color: GrayColors.gray30,
  },
  learningStatusBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 16,
    paddingHorizontal: 20,
    backgroundColor: GrayColors.gray10,
    borderRadius: 8,
  },
});
