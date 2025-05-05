import React, { useCallback, useEffect, useState, useRef } from "react";
import { StyleSheet, ScrollView, View, Text, FlatList } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useFocusEffect, router } from "expo-router";

import { FontStyle } from "@/constants/Font";
import { MainColors, GrayColors } from "@/constants/Colors";

import Header from "@/components/ui/header";
import LearningStatusCard from "@/components/ui/screen/total/TopTotalContents";
import Divider from "@/components/ui/Divider";
import TodaySummaryContents from "@/components/ui/screen/total/TodaySummaryContents";
import ProblemTotalList from "@/components/ui/list/ProblemTotalList";

import {
  TotalLearningFullStats,
  getFolderLearningStats,
  getTotalLearningStats,
} from "@/utils/cloud/learning";
import { getAllUserFolders, FolderDoc } from "@/utils/cloud/folders";
import { formatDuration } from "@/utils/formatDuration";
import { formatToHM } from "@/utils/formatToHM";

type FolderWithStats = FolderDoc & {
  stats: TotalLearningFullStats | null;
};

export default function ShareScreen() {
  const flatListRef = useRef<FlatList>(null);

  const [accuaryTab, setAccuaryTab] = useState<boolean>(false);
  const [modeTab, setModeTab] = useState<boolean>(false);

  // 학습 내역
  const [stats, setStats] = useState<TotalLearningFullStats | null>(null);

  // 총합 기록
  const fetchStats = async () => {
    const result = await getTotalLearningStats(); // or getTotalLearningStats / getFolderLearningStats("abc")
    if (result) {
      setStats(result);
      console.log(result);
    }
  };

  const [folderList, setFolderList] = useState<FolderWithStats[]>([]);

  const fetchData = async () => {
    const folders = await getAllUserFolders();

    const results = await Promise.all(
      folders.map(async (folder) => {
        const stats = await getFolderLearningStats(folder.id);
        return {
          ...folder,
          stats,
        };
      })
    );

    setFolderList(results);
  };

  useFocusEffect(
    useCallback(() => {
      fetchData();
      fetchStats();
      setAccuaryTab(true);
      setModeTab(false);
      return () => {
        flatListRef.current?.scrollToOffset({ offset: 0, animated: true });
      };
    }, [])
  );

  useEffect(() => {
    console.log(folderList);
  }, [folderList]);

  return (
    <SafeAreaView style={styles.container}>
      <Header title="통계" />
      <FlatList
        ref={flatListRef}
        data={folderList}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.contents}
        ListHeaderComponent={
          <>
            <Text style={styles.title}>이번 주 학습 현황</Text>
            <LearningStatusCard />
            <Divider />
            <Text style={styles.title}>전체 학습 통계</Text>
            <TodaySummaryContents
              totalLearningTime={
                stats?.totalSolvedProblems !== undefined
                  ? formatToHM(stats?.totalDuration)
                  : "로딩중"
              }
              totalLearningProblems={
                stats?.totalSolvedProblems !== undefined
                  ? `${stats.totalSolvedProblems}개`
                  : "로딩중"
              }
              accuaryTab={accuaryTab}
              SetAccuaryTab={setAccuaryTab}
              modeTab={modeTab}
              SetModeTab={setModeTab}
              accuracy={Math.min(Math.round(stats?.averageAccuracy || 0), 100)}
              timed={stats?.modeCount.timed || 0}
              free={stats?.modeCount.free || 0}
              review={stats?.modeCount.review || 0}
            />
            <Text style={styles.title}>폴더 별 학습 통계</Text>
          </>
        }
        renderItem={({ item }) => (
          <View
            style={{
              paddingHorizontal: 16,
              marginBottom: 16,
            }}
          >
            <ProblemTotalList
              folderName={item.title}
              totalDuration={formatDuration(item.stats?.totalDuration || 0)}
              averageAccuracy={`${Math.round(
                item.stats?.averageAccuracy || 0
              )}%`}
              onPressDetail={() => {
                router.push({
                  pathname: "/(tabs)/share/[folderId]",
                  params: { folderId: item.id, title: item.title },
                });
              }}
            />
          </View>
        )}
        ListEmptyComponent={
          <View style={{ padding: 32, alignItems: "center" }}>
            <Text style={styles.emptyText}>학습 내역이 없습니다.</Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contents: {
    flexGrow: 1,
  },
  title: {
    ...FontStyle.modalTitle,
    color: GrayColors.black,
    marginVertical: 24,
    marginHorizontal: 16,
  },
  emptyText: {
    ...FontStyle.contentsText,
    color: GrayColors.gray40,
  },
});
