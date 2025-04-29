import { StyleSheet } from "react-native";
import { View, Text, TouchableOpacity, FlatList } from "react-native";
import { router } from "expo-router";

import { FontStyle } from "@/constants/Font";
import { GrayColors, MainColors } from "@/constants/Colors";
import Feather from "@expo/vector-icons/Feather";
import { AnimatedCircularProgress } from "react-native-circular-progress";

import { SolvedFolder } from "@/app/(tabs)/record";
import { useUserFolders } from "@/utils/firebase/useUserFolders";
import { handleSolvedTitle } from "@/utils/solve/handleSolvedTitle";

type RecentProps = {
  recentFolders: SolvedFolder[];
};

export default function RecentSolvedFolderList({ recentFolders }: RecentProps) {
  const folders = useUserFolders();

  const getColorByAccuracy = (percent: number) => {
    if (percent >= 70) return MainColors.safe; // 초록
    if (percent >= 30) return "#FF8A3D"; // 주황
    return MainColors.danger; // 빨강
  };
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>최근에 푼 문제</Text>
        <TouchableOpacity
          style={styles.flexRow}
          activeOpacity={0.8}
          onPress={() => router.push("/(tabs)/record")}
        >
          <Text style={styles.subDesTitle}>기록으로</Text>
          <Feather name="chevron-right" size={24} color={GrayColors.black} />
        </TouchableOpacity>
      </View>
      <FlatList
        data={recentFolders || []}
        keyExtractor={(item) => item.id}
        horizontal // 👈 가로 스크롤!
        showsHorizontalScrollIndicator={false} // 스크롤 바 숨기기
        contentContainerStyle={styles.contents}
        renderItem={({ item }) => {
          let modeName = "";

          switch (item.mode) {
            case "timed":
              modeName = "시간 제한 모드";
              break;
            case "free":
              modeName = "자유 모드";
              break;
            case "review":
              modeName = "해설 모드";
              break;
            default:
              modeName = "기타 모드";
              break;
          }
          return (
            <TouchableOpacity
              style={styles.recentFolderCard}
              activeOpacity={0.8}
              onPress={() => {
                router.push({
                  pathname: "/(tabs)/record/[solvedId]/indext",
                  params: {
                    solvedId: item.id,
                    title: handleSolvedTitle(folders, item),
                    mode: item.mode,
                    folderId: item.folderId,
                  },
                });
              }}
            >
              <View style={{ justifyContent: "space-between" }}>
                <Text style={styles.listTitle}>
                  {handleSolvedTitle(folders, item)}
                </Text>
                <View>
                  <View
                    style={[
                      styles.flexRow,
                      {
                        gap: 8,
                      },
                    ]}
                  >
                    <Feather
                      name="calendar"
                      size={12}
                      color={GrayColors.gray30}
                    />
                    <Text style={styles.date}>{item.date}</Text>
                  </View>
                  <View
                    style={[
                      styles.flexRow,
                      {
                        gap: 8,
                      },
                    ]}
                  >
                    {item.mode === "timed" && (
                      <Feather
                        name="clock"
                        size={12}
                        color={GrayColors.gray30}
                      />
                    )}
                    {item.mode === "free" && (
                      <Feather
                        name="play"
                        size={12}
                        color={GrayColors.gray30}
                      />
                    )}
                    {item.mode === "review" && (
                      <Feather
                        name="edit-3"
                        size={12}
                        color={GrayColors.gray30}
                      />
                    )}
                    <Text style={styles.date}>{modeName}</Text>
                  </View>
                </View>
              </View>
              <View>
                <AnimatedCircularProgress
                  size={80} // 원 전체 크기
                  width={8} // 원 두께
                  fill={item.accuracy} // 퍼센트 (0~100)
                  tintColor={getColorByAccuracy(item.accuracy)} // 진행된 부분 색상
                  backgroundColor={GrayColors.gray20} // 남은 부분 배경 색
                  lineCap="round"
                  rotation={0}
                >
                  {() => (
                    <Text
                      style={{
                        ...FontStyle.subTitle,
                        color: getColorByAccuracy(item.accuracy),
                      }}
                    >
                      {item.correctCount} / {item.totalCount}
                    </Text>
                  )}
                </AnimatedCircularProgress>
              </View>
            </TouchableOpacity>
          );
        }}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>아직 푼 문제가 없습니다.</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 24,
    paddingHorizontal: 16,
  },
  flexRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: {
    ...FontStyle.modalTitle,
    color: GrayColors.black,
  },
  subDesTitle: {
    ...FontStyle.bedgeText,
    color: GrayColors.gray40,
    marginRight: 8,
  },
  contents: {
    flexGrow: 1,
    paddingVertical: 24,
    paddingHorizontal: 4,
    gap: 12,
  },
  recentFolderCard: {
    borderRadius: 8,
    borderWidth: 1,
    borderColor: GrayColors.gray10,
    padding: 16,
    gap: 32,
    flexDirection: "row",
  },
  date: {
    fontSize: 10,
    fontFamily: "Pretendard-Medium",
    color: GrayColors.gray30,
  },
  listTitle: {
    ...FontStyle.subTitle,
    color: GrayColors.black,
  },
  modeBadge: {
    ...FontStyle.textBoxLabel,
    color: GrayColors.gray30,
  },
  emptyContainer: {
    width: "100%",
    paddingTop: 32,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyText: {
    ...FontStyle.contentsText,
    color: GrayColors.gray40,
  },
});
