import React from "react";
import { useState, useEffect } from "react";
import { StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { View, Text } from "react-native";
import { router } from "expo-router";

import { GrayColors, MainColors } from "@/constants/Colors";
import { FontStyle } from "@/constants/Font";

import Header from "@/components/ui/header";
import AddBtn from "@/components/ui/button/AddBtn";
import ModalContainer from "@/components/ui/modal/ModalContainer";
import ModalTextbox from "@/components/ui/modal/ModalTextbox";
import ProblemList from "@/components/ui/list/ProblemList";

export default function ProblemScreen() {
  // 헤더 검색창
  const [isSearchMode, setIsSearchMode] = useState(false);
  const [searchText, setSearchText] = useState("");

  // 문제 추가 모달
  const [openModal, setOpenModal] = useState(false);
  const [folderText, setFolderText] = useState("");

  // 일반 데이터
  const problems = [
    { id: "1", title: "문제 1" },
    { id: "2", title: "문제 2" },
    { id: "3", title: "문제 3" },
  ];

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
      >
        <View>
          <Text
            style={{
              ...FontStyle.subTitle,
              color: GrayColors.black,
              marginBottom: 8,
            }}
          >
            폴더명
          </Text>
          <ModalTextbox
            folderText={folderText}
            onChangeFolderText={setFolderText}
            onPressClear={() => setFolderText("")}
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
        <View
          style={{
            flex: 1,
            marginTop: 8,
          }}
        >
          {problems.map((problem, idx) => {
            return (
              <View
                key={idx}
                style={{
                  marginBottom: 16,
                }}
              >
                <ProblemList
                  folderName={problem.title}
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
        <View
          style={{
            alignItems: "flex-end",
          }}
        >
          <AddBtn onPress={() => setOpenModal(true)} />
        </View>
      </View>
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
});
