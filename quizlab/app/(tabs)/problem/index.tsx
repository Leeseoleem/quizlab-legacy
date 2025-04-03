import React from "react";
import { useState, useEffect, useRef } from "react";
import { StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { View, Text, Image } from "react-native";
import { router } from "expo-router";

import { createFolder, getUserFolders, Folder } from "@/utils/folders";
import { auth } from "@/lib/firebaseConfig";

import { GrayColors, MainColors } from "@/constants/Colors";
import { FontStyle } from "@/constants/Font";
import CUCat from "@/assets/images/CUcat.png";

import Header from "@/components/ui/header";
import AddBtn from "@/components/ui/button/AddBtn";
import ModalContainer from "@/components/ui/modal/ModalContainer";
import ModalTextbox from "@/components/ui/modal/ModalTextbox";
import ProblemList from "@/components/ui/list/ProblemList";
import showToast from "@/utils/showToast";
import BottomModal, {
  BottomModalRef,
} from "@/components/ui/bottoModal/BottomModal";

export default function ProblemScreen() {
  // 헤더 검색창
  const [isSearchMode, setIsSearchMode] = useState(false);
  const [searchText, setSearchText] = useState("");

  // 문제 추가 모달
  const [openModal, setOpenModal] = useState(false);
  const [folderText, setFolderText] = useState("");
  const [folderDesText, setFolderDesText] = useState("");

  const [folders, setFolders] = useState<Folder[]>([]);

  useEffect(() => {
    const fetchFolders = async () => {
      const user = auth.currentUser;
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
      }
    };

    fetchFolders();
  }, []);

  // 일반 데이터
  const problems = [
    {
      id: "1",
      title: "정보처리기사 1과목: 소프트웨어 설계- 자주 틀리는 문제",
      subscribe: "정보처리기사 1과목: 소프트웨어 설계- 자주 틀리는 문제",
    },
    { id: "2", title: "문제 2", subscribe: "문제2 입니다." },
    { id: "3", title: "문제 3", subscribe: "문제3 입니다." },
  ];

  const handleCreateFolder = async () => {
    try {
      const user = auth.currentUser; // 현재 사용중인 유저 정보

      if (!user) {
        showToast("로그인이 만료되었습니다");
        router.replace("/(auth)/login");
        return;
      }
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

  const handleOpenModal = () => {
    bottomModalRef.current?.open();
  };

  return (
    <SafeAreaView style={styles.container}>
      <ModalContainer
        visible={openModal}
        onRequestClose={() => setOpenModal(false)}
        onPressBack={() => setOpenModal(false)}
        title="새 문제 만들기"
        type="back"
        btnTitleLeft="취소"
        btnTitleRight="완료"
        onPressCancle={() => setOpenModal(false)}
        onPressOk={handleCreateFolder}
      >
        <View
          style={{
            marginBottom: 24,
          }}
        >
          <Text
            style={{
              ...FontStyle.textBoxLabel,
              color: GrayColors.black,
              marginBottom: 8,
            }}
          >
            폴더명
          </Text>
          <ModalTextbox
            folderText={folderText}
            placeholder="폴더명을 입력하세요"
            onChangeFolderText={setFolderText}
            onPressClear={() => setFolderText("")}
          />
        </View>
        <View>
          <Text
            style={{
              ...FontStyle.textBoxLabel,
              color: GrayColors.black,
              marginBottom: 8,
            }}
          >
            설명
          </Text>
          <ModalTextbox
            folderText={folderDesText}
            placeholder="문제에 대한 설명을 입력해주세요"
            onChangeFolderText={setFolderDesText}
            onPressClear={() => setFolderDesText("")}
          />
        </View>
      </ModalContainer>

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
        {folders.length !== 0 ? (
          <View
            style={{
              flex: 1,
              marginTop: 8,
            }}
          >
            {folders.map((problem, idx) => {
              return (
                <View
                  key={idx}
                  style={{
                    marginBottom: 16,
                  }}
                >
                  <ProblemList
                    folderName={problem.title}
                    folderSub={problem.description}
                    deleteList={handleOpenModal}
                    onPressSolve={() => {
                      router.push({
                        pathname: "/(tabs)/problem/[folderId]",
                        params: { folderId: problem.id, title: problem.title },
                      });
                    }}
                  />
                </View>
              );
            })}
          </View>
        ) : (
          <View
            style={{
              flex: 1,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Image
              source={CUCat}
              style={{
                width: 250,
                height: 250,
              }}
            />
            <Text style={styles.guideText}>아직 등록된 문제가 없어요.</Text>
            <Text style={styles.guideText}>
              + 버튼을 눌러 문제를 추가해주세요!
            </Text>
          </View>
        )}
        <View
          style={{
            alignItems: "flex-end",
          }}
        >
          <AddBtn onPress={() => setOpenModal(true)} />
        </View>
      </View>
      <BottomModal ref={bottomModalRef} title="하이" />
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
    fontSize: 16,
    fontFamily: "Pretendard-Regular",
    color: GrayColors.black,
  },
});
