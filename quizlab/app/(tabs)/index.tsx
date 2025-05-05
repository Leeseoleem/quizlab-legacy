import { useCallback, useEffect, useState } from "react";
import { Image, StyleSheet, ScrollView, ActivityIndicator } from "react-native";
import { useFocusEffect } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { View, Text } from "react-native";
import { GrayColors, MainColors } from "@/constants/Colors";

import mainCat from "@/assets/images/mainCat.png";
import DailyProgressCard from "@/components/ui/card/DailyProgressCard";
import Divider from "@/components/ui/Divider";
import RecentSolvedFolderList from "@/components/ui/list/RecentSolvedFolderList";

import { fetchCurrentUserInfo } from "@/utils/userInfoFetcher";
import { FontStyle } from "@/constants/Font";
import { todayDate } from "@/utils/cloud/learning";

import { SolvedFolder } from "./record";
import {
  getUserLearningInfo,
  UserLearningInfo,
  getTodayLearningStats,
  TotalLearningStats,
} from "@/utils/cloud/learning";
import { getRecentSolvedFolders } from "@/utils/cloud/solved";

export default function HomeScreen() {
  // 유저 닉네임
  const [editNickname, setEditNickname] = useState<string>("");
  // 유저 정보 로드
  const [userInfo, setUserInfo] = useState<{
    uid: string;
    email: string | null;
    nickname: string | null;
    photoURL: string | null;
  } | null>(null);

  // 연속 학습 기록
  const [streakInfo, setStreakInfo] = useState<UserLearningInfo | null>(null);

  // 최근 풀이 폴더
  const [recentFolders, setRecentFolders] = useState<SolvedFolder[]>([]);
  const date = todayDate(); // 현재 날짜
  const [isTodayLearned, setIsTodayLearned] = useState<boolean>(false);

  // 오늘의 기록: 총 학습 시간 / 푼 문제 수
  const [stats, setStats] = useState<TotalLearningStats | null>(null);

  // 닉네임 가져오기
  const fetchUser = async () => {
    const user = await fetchCurrentUserInfo();
    setUserInfo(user);

    // editNickname도 동기화
    if (user?.nickname) {
      setEditNickname(user.nickname);
    }
  };

  // 연속 정보 저장
  const fetchStreakInfo = async () => {
    const info = await getUserLearningInfo();
    if (info) {
      setStreakInfo(info); // 받아온 정보를 상태에 저장
    }
  };

  const fetchRecentFolders = async () => {
    const recent = await getRecentSolvedFolders();
    if (recent) {
      setRecentFolders(recent);
    }
  };

  // 오늘의 기록
  const fetchStats = async () => {
    const result = await getTodayLearningStats(); // or getTotalLearningStats / getFolderLearningStats("abc")
    if (result) setStats(result);
  };

  useFocusEffect(
    useCallback(() => {
      fetchUser();
      fetchStreakInfo();
      fetchRecentFolders();
      fetchStats();
    }, [])
  );

  useEffect(() => {
    if (streakInfo?.lastLearnedDate === date) {
      setIsTodayLearned(true);
    } else {
      setIsTodayLearned(false);
    }
  }, [streakInfo, date]);

  if (!streakInfo || !recentFolders || !stats) {
    return (
      <SafeAreaView
        style={[
          styles.container,
          {
            justifyContent: "center",
            alignItems: "center",
          },
        ]}
      >
        <ActivityIndicator size="large" color={MainColors.primary} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.topContent}>
          <View
            style={{
              gap: 8,
            }}
          >
            <Text style={styles.title}>{editNickname}의 실험실</Text>
            <Text style={styles.subTitle}>오늘도 함께 문제를 풀어볼까요?</Text>
          </View>
          <Image source={mainCat} style={styles.mainLogo} />
        </View>
        <View>
          <DailyProgressCard
            isTodayLearned={isTodayLearned}
            currentStreak={isTodayLearned ? streakInfo?.currentStreak : 0}
            stats={stats}
          />
        </View>
        <Divider />
        <View>
          <RecentSolvedFolderList recentFolders={recentFolders} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: GrayColors.white,
  },
  topContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingVertical: 32,
  },
  mainLogo: {
    height: 150,
    width: 150,
  },
  title: {
    ...FontStyle.boldTitle,
  },
  subTitle: {
    ...FontStyle.bedgeText,
    color: GrayColors.gray30,
  },
});
