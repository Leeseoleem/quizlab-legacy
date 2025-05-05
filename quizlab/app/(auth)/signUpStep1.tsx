import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { StyleSheet } from "react-native";
import { View, Text } from "react-native";
import { TextInput } from "react-native-paper";

import { FontStyle } from "@/constants/Font";
import { MainColors, GrayColors } from "@/constants/Colors";
import { validateNickname } from "@/utils/valid/validateNickname";

import Octicons from "@expo/vector-icons/Octicons";

import Header from "@/components/ui/header";
import Button from "@/components/ui/button/Button";

export default function SignUpStep1() {
  const [nickname, setNickname] = useState<string>("");

  useEffect(() => {
    console.log(validateNickname(nickname));
  }, [nickname]);
  return (
    <SafeAreaView style={styles.container}>
      <Header
        title="회원 가입"
        showBack={true}
        onPressBack={() => {
          router.back();
        }}
      />
      <View style={styles.section}>
        <Text style={styles.title}>사용하실 이름을 알려주세요</Text>
        <View>
          <TextInput
            label="이름"
            value={nickname}
            onChangeText={(text) => setNickname(text)}
            mode="flat" // 'flat' 또는 'outlined'
            underlineColor={MainColors.secondary}
            activeUnderlineColor={MainColors.primary}
            style={{
              backgroundColor: GrayColors.white,
              fontFamily: "Pretendard-Medium",
              justifyContent: "center",
            }}
            theme={{
              colors: {
                primary: MainColors.primary, // 라벨 활성화 색상
                text: GrayColors.black, // 입력 텍스트 색상
                placeholder: GrayColors.gray20, // 라벨 비활성화 색상
              },
            }}
          />
          {validateNickname(nickname) && (
            <Text style={styles.validationText}>
              {validateNickname(nickname)}
            </Text>
          )}
        </View>
      </View>
      <View style={styles.bottomContents}>
        <Button
          type={validateNickname(nickname) ? "non" : "default"}
          btnTitle="다음"
          onPress={() => {
            router.push({
              pathname: "/signUpStep2",
              params: { nickname: nickname },
            });
          }}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-between",
  },
  section: {
    flex: 1,
    paddingVertical: 32,
    paddingHorizontal: 16,
    gap: 60,
  },
  title: {
    ...FontStyle.title,
  },
  validationText: {
    marginTop: 8,
    marginLeft: 8,
    ...FontStyle.bedgeText,
    color: MainColors.primary,
  },
  bottomContents: {
    padding: 16,
  },
});
