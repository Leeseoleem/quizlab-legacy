import React, { useEffect, useRef, useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Dimensions,
  TouchableOpacity,
  Pressable,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useFocusEffect } from "@react-navigation/native";
import * as Progress from "react-native-progress";

import { checkAuthAndRedirect } from "@/utils/firebase/checkUser";
import { getUserFolders, Folder } from "@/utils/cloud/folders";
import {
  getSolvedFoldersByFolderId,
  deleteSolvedFolder,
} from "@/utils/cloud/solved";
import { SolvedFolderDoc } from "@/types/solved";
import { handleSolvedTitle } from "@/utils/solve/handleSolvedTitle";
import { formatSmartDate } from "@/utils/formatDate";
import showToast from "@/utils/showToast";

import Header from "@/components/ui/header";
import ProblemListMenu from "@/components/ui/list/ProblemListMenu";
import BottomListModal, {
  BottomModalRef,
} from "@/components/ui/bottoModal/BottomListModal";

import { GrayColors, MainColors } from "@/constants/Colors";
import { FontStyle } from "@/constants/Font";
import Feather from "@expo/vector-icons/Feather";
import { router } from "expo-router";

export type SolvedFolder = { id: string } & SolvedFolderDoc;
const { width, height } = Dimensions.get("window");

export default function RecordScreen() {
  const user = checkAuthAndRedirect(); // 유저 로그인 여부 체크

  const [isLoading, setIsLoading] = useState(true); // 로딩 상태 추가
  const [folders, setFolders] = useState<Folder[]>([]);

  const fetchFolders = async () => {
    if (!user) return;

    try {
      const data = await getUserFolders(user.uid);

      if (!data || data.length === 0) {
        console.log("가져온 폴더 없음 → 빈 배열로 설정");
        setFolders([]); // 명시적으로 빈 배열 설정
      } else {
        setFolders(data); // 데이터 있음
      }
    } catch (error) {
      console.error("폴더 불러오기 실패:", error);
      setFolders([]); // 오류 발생 시에도 안전하게 빈 배열로 설정
    } finally {
      setIsLoading(false); // 무조건 로딩 끝 처리
    }
  };

  useEffect(() => {
    fetchFolders();
  }, []);

  const modalRef = useRef<BottomModalRef>(null);
  const [selectedId, setSelectedId] = useState("");

  const [title, setTitle] = useState("");
  const [solvedFolder, setSolvedFolder] = useState<SolvedFolder[]>();

  const handleSelectList = async () => {
    if (selectedId === "") {
      setTitle("전체");
      // 전체 가져오기
      const allSolved = await getSolvedFoldersByFolderId();
      if (allSolved) {
        setSolvedFolder(allSolved);
      }
    } else {
      const selectTitle = folders.find((f) => f.id === selectedId)?.title;
      if (selectTitle) setTitle(selectTitle);
      // 특정 폴더만 가져오기
      const specific = await getSolvedFoldersByFolderId(selectedId);
      if (specific) {
        setSolvedFolder(specific);
      }
    }
  };

  const handleDeleteFolder = async (solvedId: string) => {
    if (!user) return;
    try {
      await deleteSolvedFolder(solvedId);
      handleSelectList();

      showToast("기록이 삭제되었습니다");
    } catch (e) {
      showToast("오류가 발생했습니다");
    }
  };

  const listRef = useRef<FlatList>(null); // FlatList전용

  useEffect(() => {
    handleSelectList();
    listRef.current?.scrollToOffset({ animated: false, offset: 0 });
  }, [selectedId]);

  useEffect(() => {
    console.log("🟢 solvedFolder 변경됨:", solvedFolder?.length);
  }, [solvedFolder]);

  useFocusEffect(
    useCallback(() => {
      // 화면에 진입할 때 실행됨
      fetchFolders();
      setSelectedId(""); // 텍스트 초기화

      // ❗ cleanup은 선택 (화면 빠져나갈 때)
      return () => {
        console.log("Screen unfocused");
        listRef.current?.scrollToOffset({ animated: false, offset: 0 });
      };
    }, []) // 의존성 없으면 화면 진입마다 실행됨
  );

  return (
    <SafeAreaView style={styles.container}>
      <Header title="기록" />
      <ProblemListMenu title={title} onPress={() => modalRef.current?.open()} />
      <FlatList
        ref={listRef}
        showsVerticalScrollIndicator={false}
        data={solvedFolder}
        keyExtractor={(data) => data.id}
        renderItem={({ item }) => {
          let percent = item.accuracy / 100;
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

          const bgColor =
            percent < 0.3
              ? MainColors.danger // 빨강
              : percent < 0.6
              ? MainColors.primary // 주황
              : percent < 0.8
              ? "#FFD43B" // 노랑
              : MainColors.safe; // 초록
          return (
            <TouchableOpacity
              style={styles.listContainer}
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
              <View style={styles.listHeader}>
                <View>
                  <View style={styles.titleContent}>
                    <Text style={styles.listTitle}>
                      {handleSolvedTitle(folders, item)}
                    </Text>
                    <Pressable
                      style={({ pressed }) => [
                        styles.trashLine,
                        {
                          backgroundColor: pressed
                            ? MainColors.dangerSec
                            : undefined,
                        },
                      ]}
                      onPress={() => {
                        handleDeleteFolder(item.id);
                      }}
                    >
                      <Feather
                        name="trash-2"
                        size={20}
                        color={MainColors.primary}
                      />
                    </Pressable>
                  </View>

                  <View style={{ height: 16 }} />
                  <View
                    style={{
                      flexGrow: 1,
                      alignItems: "flex-start",
                    }}
                  >
                    <View style={styles.listOther}>
                      <Feather
                        name="calendar"
                        size={14}
                        color={GrayColors.gray30}
                      />
                      <View style={styles.gap_v} />
                      <Text style={styles.date}>
                        {formatSmartDate(item.startedAt)}
                      </Text>
                    </View>
                    <View style={styles.gap_h} />
                    <View style={styles.listOther}>
                      {item.mode === "timed" && (
                        <Feather
                          name="clock"
                          size={14}
                          color={GrayColors.gray30}
                        />
                      )}
                      {item.mode === "free" && (
                        <Feather
                          name="play"
                          size={14}
                          color={GrayColors.gray30}
                        />
                      )}
                      {item.mode === "review" && (
                        <Feather
                          name="edit-3"
                          size={14}
                          color={GrayColors.gray30}
                        />
                      )}
                      <View style={styles.gap_v} />
                      <Text style={styles.modeBadge}>{modeName}</Text>
                    </View>
                  </View>
                </View>
              </View>
              <View
                style={{
                  height: 24,
                }}
              />
              <View style={styles.count}>
                <Feather
                  name="check-circle"
                  size={18}
                  color={GrayColors.grayHax}
                />
                <View style={styles.gap_v} />
                <Text style={styles.countText}>{item.correctCount}</Text>
                <Text style={styles.countText}> / </Text>
                <Text style={styles.countText}>{item.totalCount}</Text>
              </View>
              <View style={styles.gap_h} />
              <Progress.Bar
                progress={percent}
                height={10}
                width={width - 64}
                color={bgColor}
                unfilledColor={GrayColors.gray10}
                borderWidth={0}
              />
            </TouchableOpacity>
          );
        }}
        contentContainerStyle={{
          backgroundColor: GrayColors.gray10,
          padding: 16, // 전체 패딩
          gap: 16, // 요소 간 간격
        }}
      />
      <BottomListModal
        ref={modalRef}
        folders={folders}
        selectedId={selectedId}
        onSelect={(folderId) => {
          setSelectedId(folderId);
          console.log(folderId);
          modalRef.current?.close();
        }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    flex: 1,
    padding: 36,
    alignItems: "center",
  },
  gap_h: {
    height: 8,
  },
  gap_v: {
    width: 8,
  },
  listContainer: {
    borderRadius: 10,
    padding: 16,
    backgroundColor: GrayColors.white,
  },
  listHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  titleContent: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignContent: "center",
  },
  listOther: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  modeBadge: {
    ...FontStyle.textBoxLabel,
    color: GrayColors.gray30,
  },
  date: {
    ...FontStyle.bedgeText,
    color: GrayColors.gray30,
  },
  listTitle: {
    ...FontStyle.modalTitle,
  },
  trashLine: {
    borderRadius: 40,
    width: 30,
    height: 30,
    alignItems: "center",
    justifyContent: "center",
  },
  count: {
    flexDirection: "row",
    alignItems: "center",
  },
  countText: {
    ...FontStyle.bedgeText,
    color: GrayColors.gray40,
  },
});
