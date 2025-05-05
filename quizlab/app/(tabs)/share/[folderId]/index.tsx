import { useRef, useState, useCallback } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { ProgressBar } from "react-native-paper";
import { StyleSheet, View, Text, FlatList, Dimensions } from "react-native";

import { LineChart } from "react-native-chart-kit";

import { FontStyle } from "@/constants/Font";
import { GrayColors, MainColors } from "@/constants/Colors";
import { format, parseISO } from "date-fns";

import Header from "@/components/ui/header";
import TodaySummaryContents from "@/components/ui/screen/total/TodaySummaryContents";
import Divider from "@/components/ui/Divider";
import WrongProblemsCard from "@/components/ui/screen/total/WrongProblemsCard";

import { router, useLocalSearchParams, useFocusEffect } from "expo-router";
import {
  getFolderLearningStats,
  TotalLearningFullStats,
} from "@/utils/cloud/learning";
import {
  getWrongTop5ByFolder,
  WrongProblemSummary,
} from "@/utils/cloud/solved";
import { AccuracyPoint, getFolderAccuracyByDate } from "@/utils/cloud/solved";

import { formatToHM } from "@/utils/formatToHM";
import { fillMissingDates } from "@/utils/date/fillMissingDates";

const screenWidth = Dimensions.get("window").width;

export default function TotalDetailScreen() {
  const { folderId, title } = useLocalSearchParams();

  const flatListRef = useRef<FlatList>(null);

  // 학습 내역
  const [stats, setStats] = useState<TotalLearningFullStats | null>(null);

  const [accuaryTab, setAccuaryTab] = useState<boolean>(false);
  const [modeTab, setModeTab] = useState<boolean>(false);

  // 총합 기록
  const fetchStats = async () => {
    const result = await getFolderLearningStats(folderId as string); // or getTotalLearningStats / getFolderLearningStats("abc")
    if (result) {
      setStats(result);
      console.log(result);
    }
  };

  // 정답률 변화
  const [chartData, setChartData] = useState<AccuracyPoint[]>([]);

  const fetchAccuracy = async () => {
    const result = await getFolderAccuracyByDate(folderId as string);

    setChartData(result);
    console.log("정답률: ", result);
  };

  const lineChartData = {
    labels: chartData.map((d) => format(parseISO(d.date), "MM-dd")), // "04-21"
    datasets: [
      {
        data: chartData.map((d) => d.accuracy),
        color: (opacity = 1) => `rgba(255, 102, 0, ${opacity})`,
        strokeWidth: 2,
      },
    ],
  };

  // 자주 틀리는 문제
  const [wrongProblems, setWrongProblems] = useState<WrongProblemSummary[]>([]);

  const fetchWrongProblemList = async () => {
    const data = await getWrongTop5ByFolder(folderId as string);
    setWrongProblems(data);
  };

  useFocusEffect(
    useCallback(() => {
      fetchStats();
      fetchWrongProblemList();
      fetchAccuracy();
      setAccuaryTab(true);
      setModeTab(false);
      return () => {
        flatListRef.current?.scrollToOffset({ offset: 0, animated: true });
      };
    }, [])
  );

  return (
    <SafeAreaView style={styles.container}>
      <Header
        title={title as string}
        showBack={true}
        onPressBack={() => {
          router.back();
        }}
      />
      <FlatList
        ref={flatListRef}
        data={wrongProblems}
        keyExtractor={(item) => item.problemId}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.contents}
        ListHeaderComponent={
          <>
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
            <Text
              style={[
                styles.title,
                {
                  marginBottom: 8,
                },
              ]}
            >
              정확도 변화 기록
            </Text>
            <Text style={styles.subTitle}>
              최근 풀이를 기반으로, 문제 풀이 기록을 분석했어요
            </Text>
            <LineChart
              data={lineChartData}
              width={screenWidth - 32}
              height={250}
              withDots={true}
              withShadow={false}
              withInnerLines={true}
              fromZero={true}
              yAxisSuffix="%"
              chartConfig={{
                backgroundColor: GrayColors.white,
                backgroundGradientFrom: GrayColors.white,
                backgroundGradientTo: GrayColors.white,
                decimalPlaces: 0,
                color: (opacity = 1) => `rgba(255, 102, 0, ${opacity})`,
                labelColor: () => GrayColors.gray30,
                propsForDots: {
                  r: "4",
                  strokeWidth: "2",
                  stroke: GrayColors.white,
                },
              }}
              bezier
            />
            <Divider />
            <Text
              style={[
                styles.title,
                {
                  marginBottom: 8,
                },
              ]}
            >
              자주 틀리는 문제
            </Text>
            <Text style={styles.subTitle}>
              최근 기록을 기반으로, 정답률이 낮았던 문제들을 정리했어요.
            </Text>
          </>
        }
        renderItem={({ item, index }) => (
          <View
            style={{
              paddingHorizontal: 16,
              marginBottom: 16,
            }}
          >
            <WrongProblemsCard index={index} item={item} />
          </View>
        )}
        ListEmptyComponent={
          <View style={{ padding: 32, alignItems: "center" }}>
            <Text style={styles.emptyText}>자주 틀리는 문제가 없습니다.</Text>
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
  subTitle: {
    ...FontStyle.textBoxLabel,
    color: GrayColors.gray30,
    marginBottom: 24,
    marginHorizontal: 16,
  },
  emptyText: {
    ...FontStyle.contentsText,
    color: GrayColors.gray40,
  },
});
