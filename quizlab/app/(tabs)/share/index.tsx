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

type FolderWithStats = FolderDoc & {
  stats: TotalLearningFullStats | null;
};

export default function ShareScreen() {
  const flatListRef = useRef<FlatList>(null);

  const [accuaryTab, setAccuaryTab] = useState<boolean>(false);
  const [modeTab, setModeTab] = useState<boolean>(false);

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
              accuaryTab={accuaryTab}
              SetAccuaryTab={setAccuaryTab}
              modeTab={modeTab}
              SetModeTab={setModeTab}
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
            <Text style={styles.emptyText}>표시할 데이터가 없습니다.</Text>
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
