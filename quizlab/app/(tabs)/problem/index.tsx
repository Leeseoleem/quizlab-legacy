import React from "react";
import { useState, useEffect, useRef } from "react";
import { FlatList, StyleSheet, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { View, Text, Image } from "react-native";
import { router } from "expo-router";
import {
  createFolder,
  getUserFolders,
  updateFolder,
  deleteFolder,
  searchFolderByKeyword,
  Folder,
} from "@/utils/cloud/folders";
import { auth } from "@/lib/firebaseConfig";

import { GrayColors, MainColors } from "@/constants/Colors";
import CUCat from "@/assets/images/CUcat.png";
import XCat from "@/assets/images/xCat.png";

import Header from "@/components/ui/header";
import AddBtn from "@/components/ui/button/AddBtn";
import ProblemList from "@/components/ui/list/ProblemList";
import showToast from "@/utils/showToast";
import { checkAuthAndRedirect } from "@/utils/firebase/checkUser";

import CreateFolderModal from "@/components/ui/modal/screenModal/CreatFolderModal";
import EditFolderModal from "@/components/ui/modal/screenModal/EditFolderModal";
import BottomModal, {
  BottomModalRef,
} from "@/components/ui/bottoModal/BottomModal";

export default function ProblemScreen() {
  const user = checkAuthAndRedirect(); // 유저 로그인 여부 체크
  // 헤더 검색창
  const [isSearchMode, setIsSearchMode] = useState(false);
  const [searchText, setSearchText] = useState("");

  // 문제 추가 모달
  const [openModal, setOpenModal] = useState(false);
  const [folderText, setFolderText] = useState("");
  const [folderDesText, setFolderDesText] = useState("");

  const [folders, setFolders] = useState<Folder[]>([]);
  const [selectedFolder, setSelectedFolder] = useState<Folder | null>(null); // 선택된 폴더

  const [isLoading, setIsLoading] = useState(true); // 로딩 상태 추가

  useEffect(() => {
    const fetchFolders = async () => {
      if (!user) return;

      try {
        const data = await getUserFolders(user.uid);

        if (!data || data.length === 0) {
          console.log("📁 가져온 폴더 없음 → 빈 배열로 설정");
          setFolders([]); // 명시적으로 빈 배열 설정
        } else {
          setFolders(data); // 데이터 있음
        }
      } catch (error) {
        console.error("❌ 폴더 불러오기 실패:", error);
        setFolders([]); // 오류 발생 시에도 안전하게 빈 배열로 설정
      } finally {
        setIsLoading(false); // 무조건 로딩 끝 처리
      }
    };

    fetchFolders();
  }, []);

  useEffect(() => {
    if (!user) return;

    const fetch = async () => {
      if (isSearchMode && searchText.trim() !== "") {
        // 🔍 검색 모드
        const results = await searchFolderByKeyword(
          searchText.trim(),
          user.uid
        );
        setFolders(results);
      } else {
        // 📁 전체 폴더 가져오기
        const all = await getUserFolders(user.uid);
        setFolders(all);
      }
    };

    fetch();
  }, [isSearchMode, searchText]);

  const handleCreateFolder = async () => {
    try {
      if (!user) return;

      await createFolder(user.uid, folderText, folderDesText);
      showToast("폴더가 생성되었습니다");

      const updated = await getUserFolders(user.uid);
      setFolders(updated);
      setOpenModal(false);
      setFolderText("");
      setFolderDesText("");
    } catch (e) {
      showToast("생성에 실패하였습니다");
    }
  };

  const bottomModalRef = useRef<BottomModalRef>(null);

  // 문제 수정 모달
  const [openEditModal, setOpenEditModal] = useState(false);
  const [folderEditText, setFolderEditText] = useState("");
  const [folderEditDesText, setFolderEditDesText] = useState("");

  const handleOpenModal = (folder: Folder) => {
    setSelectedFolder(folder); // 현재 선택한 폴더 정보 저장
    setFolderEditText(folder.title);
    setFolderEditDesText(folder.description);
    bottomModalRef.current?.open(); // 모달 열기
  };

  const handelEdit = () => {
    bottomModalRef.current?.close();
    setTimeout(() => {
      setOpenEditModal(true); // 이건 일반 모달 (ex: ModalContainer)
    }, 300); // BottomSheet 애니메이션 종료 시간 고려
  };

  const handleEditFolder = async () => {
    try {
      if (!user) return;

      if (!selectedFolder?.id) {
        showToast("다시 선택해주세요");
        setOpenEditModal(false);
        return;
      }

      // 수정용 데이터
      const updatedData = {
        title: folderEditText,
        description: folderEditDesText,
      };
      await updateFolder(selectedFolder?.id, updatedData);
      showToast("폴더가 수정되었습니다");

      const updated = await getUserFolders(user.uid);
      setFolders(updated);

      setOpenEditModal(false);
      setFolderEditText("");
      setFolderEditDesText("");
    } catch (e) {
      showToast("수정이 완료되지 않았습니다");
    }
  };

  const [isDeleting, setIsDeleting] = useState(false);

  const handelDeleteFolder = async () => {
    setIsDeleting(true);
    try {
      if (!user) return;

      if (!selectedFolder?.id) {
        showToast("다시 선택해주세요");
        setOpenEditModal(false);
        return;
      }

      await deleteFolder(selectedFolder.id);

      bottomModalRef.current?.close();
      showToast("폴더가 삭제되었습니다");

      const updated = await getUserFolders(user.uid);
      setFolders(updated);
      setSelectedFolder(null);
    } catch (e) {
      showToast("오류가 발생했습니다");
    } finally {
      setIsDeleting(false); // ✅ 삭제 완료
    }
  };

  if (isDeleting) {
    <View style={{ alignItems: "center" }}>
      <ActivityIndicator size="large" color={MainColors.primary} />
    </View>;
  }

  return (
    <SafeAreaView style={styles.container}>
      <CreateFolderModal
        visible={openModal}
        onRequestClose={() => setOpenModal(false)}
        onCreateFolder={handleCreateFolder}
        folderText={folderText}
        setFolderText={setFolderText}
        folderDesText={folderDesText}
        setFolderDesText={setFolderDesText}
      />
      <EditFolderModal
        visible={openEditModal}
        onRequestClose={() => setOpenEditModal(false)}
        onEditFolder={handleEditFolder}
        folderEditText={folderEditText}
        setFolderEditText={setFolderEditText}
        folderEditDesText={folderEditDesText}
        setFolderEditDesText={setFolderEditDesText}
      />
      <Header
        title="문제"
        rightIcon="search"
        onPressSearch={() => setIsSearchMode(true)}
        onPressEndearch={() => {
          setIsSearchMode(false);
          setSearchText("");
        }}
        isSearchMode={isSearchMode}
        searchText={searchText}
        onChangeSearchText={setSearchText}
        onPressClearSearch={() => setSearchText("")}
      />
      <View style={styles.contents}>
        <View
          style={{
            flex: 1,
            marginTop: 8,
          }}
        >
          {isLoading ? (
            <View
              style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <ActivityIndicator size="large" color={MainColors.primary} />
            </View>
          ) : (
            <FlatList
              data={folders}
              keyExtractor={(item) => item.id}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={
                folders.length === 0
                  ? { flexGrow: 1, justifyContent: "center" }
                  : undefined
              }
              renderItem={({ item, index }) => {
                return (
                  <ProblemList
                    folderName={item.title}
                    folderSub={item.description}
                    deleteList={() => handleOpenModal(item)}
                    onPressSolve={() => {
                      router.push({
                        pathname: "/(tabs)/problem/[folderId]",
                        params: { folderId: item.id, title: item.title },
                      });
                    }}
                  />
                );
              }}
              ItemSeparatorComponent={() => <View style={{ height: 16 }} />}
              ListEmptyComponent={
                <View
                  style={{
                    alignItems: "center",
                  }}
                >
                  <Image
                    source={isSearchMode ? XCat : CUCat}
                    style={{
                      width: 250,
                      height: 250,
                    }}
                  />
                  {isSearchMode ? (
                    <Text style={styles.guideText}>검색 결과가 없어요...</Text>
                  ) : (
                    <View>
                      <Text style={styles.guideText}>
                        아직 등록된 문제가 없어요.
                      </Text>
                      <Text style={styles.guideText}>
                        + 버튼을 눌러 문제를 추가해주세요!
                      </Text>
                    </View>
                  )}
                </View>
              }
            />
          )}
        </View>
        <View
          style={{
            position: "absolute",
            bottom: 16,
            right: 16,
          }}
        >
          <AddBtn onPress={() => setOpenModal(true)} />
        </View>
      </View>
      <BottomModal
        ref={bottomModalRef}
        title={selectedFolder?.title ?? "폴더"}
        onEdit={handelEdit}
        onDelete={handelDeleteFolder}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
  },
  contents: {
    flex: 1,
    justifyContent: "space-between",
    backgroundColor: MainColors.primaryForeground,
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  addBtn: {
    width: 48,
    height: 48,
    borderRadius: 1000,
    backgroundColor: MainColors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  guideText: {
    fontFamily: "Pretendard-Medium",
    color: GrayColors.black,
    letterSpacing: -0.4,
  },
});
