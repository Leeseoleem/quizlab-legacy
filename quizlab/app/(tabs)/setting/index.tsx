import React from "react";
import { useState, useEffect, useCallback } from "react";
import { Image, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router, useFocusEffect } from "expo-router";
import { View, Text } from "react-native";

import { fetchCurrentUserInfo } from "@/utils/userInfoFetcher";
import { handleSignout } from "@/utils/signOut";

import Header from "@/components/ui/header";
import BtnList from "@/components/ui/list/BtnList";
import EditProfile from "@/components/ui/button/EditProfile";
import showToast from "@/utils/showToast";
import UserNullScreen from "@/components/ui/screen/UserNullScreen";
import SecessionModal from "@/components/ui/modal/screenModal/SecessionModal";

import mainLogo from "@/assets/images/mainLogoColor.png";

import { GrayColors, MainColors } from "@/constants/Colors";
import { FontStyle } from "@/constants/Font";
import { auth } from "@/lib/firebaseConfig";
import { changeNickname } from "@/utils/changeNickname";
import UpdateNicknameModal from "@/components/ui/modal/screenModal/UpdateNicknameModal";

export default function SettingScreen() {
  const user = auth.currentUser;

  // 유저 정보 로드
  const [userInfo, setUserInfo] = useState<{
    uid: string;
    email: string | null;
    nickname: string | null;
    photoURL: string | null;
  } | null>(null);

  useFocusEffect(
    useCallback(() => {
      const fetchUser = async () => {
        const user = await fetchCurrentUserInfo();
        setUserInfo(user);

        // editNickname도 동기화
        if (user?.nickname) {
          setEditNickname(user.nickname);
        }
      };

      fetchUser();
    }, [])
  );

  // 닉네임 수정
  const [openModal, setOpenModal] = useState(false);
  const closeModal = () => {
    return setOpenModal(false);
  };
  const [editNickname, setEditNickname] = useState<string>("");

  const handleChangeNickname = async () => {
    if (editNickname === "") return;
    try {
      const updatedUser = await changeNickname(editNickname);
      if (updatedUser) {
        setUserInfo(updatedUser);
        setEditNickname(updatedUser.nickname ?? "");
      }

      showToast("수정이 완료되었습니다");
      closeModal();
    } catch (e) {
      showToast("오류가 발생하였습니다");
    }
  };

  // 회원 탈퇴
  const [secessionModal, setSecessionModal] = useState(false);

  const closeSecessionModal = () => {
    return setSecessionModal(false);
  };

  if (!userInfo) {
    return <UserNullScreen />;
  }

  return (
    <SafeAreaView style={styles.container}>
      <SecessionModal
        visible={secessionModal}
        onRequestClose={closeSecessionModal}
        onPressOk={() => console.log("탈퇴")}
      />
      <UpdateNicknameModal
        visible={openModal}
        closeModal={closeModal}
        handleChangeNickname={handleChangeNickname}
        folderText={editNickname}
        onChangeFolderText={setEditNickname}
        onPressClear={() => setEditNickname("")}
      />
      <Header title="설정" />
      <View style={styles.contents}>
        <View style={styles.accountContainer}>
          <Image
            source={mainLogo}
            style={{
              width: 60,
              height: 60,
            }}
          />
          <View
            style={{
              marginLeft: 16,
            }}
          >
            <View>
              <Text
                style={{
                  ...FontStyle.modalTitle,
                  color: GrayColors.black,
                }}
              >
                {userInfo.nickname}
              </Text>
              <Text
                style={{
                  ...FontStyle.bedgeText,
                  color: GrayColors.gray30,
                }}
              >
                {userInfo.email}
              </Text>
            </View>
            <View style={{ marginTop: 12, alignSelf: "flex-start" }}>
              <EditProfile
                onPress={() => {
                  setOpenModal(true);
                }}
              />
            </View>
          </View>
        </View>
      </View>
      <View>
        <View style={styles.section}>
          <Text
            style={{
              ...FontStyle.bedgeText,
              alignSelf: "flex-end",
            }}
          >
            계정 관리
          </Text>
        </View>
        <View>
          <BtnList
            text="로그아웃"
            textColorStyle={{ color: GrayColors.black }}
            onPress={handleSignout}
          />
          <BtnList
            text="탈퇴하기"
            textColorStyle={{ color: MainColors.danger }}
            onPress={() => {
              setSecessionModal(true);
            }}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contents: {
    paddingHorizontal: 16,
  },
  accountContainer: {
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: GrayColors.gray20,
    flexDirection: "row",
    alignItems: "center",
    marginTop: 16,
    marginBottom: 32,
  },
  section: {
    width: "100%",
    height: 40,
    paddingHorizontal: 20,
    paddingVertical: 8,
    backgroundColor: GrayColors.gray10,
    flexDirection: "row",
    borderTopWidth: 1,
    borderColor: GrayColors.gray20,
  },
});
