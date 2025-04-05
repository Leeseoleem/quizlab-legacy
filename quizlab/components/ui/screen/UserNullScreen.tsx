import React from "react";
import { Image, Text, View, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import Button from "../button/Button";
import { GrayColors, MainColors } from "../../../constants/Colors";
import { FontStyle } from "../../../constants/Font";
import sadCat from "../../../assets/images/sadCat.png";
import { router } from "expo-router";

export default function UserNullScreen() {
  const navigationToLogin = () => {
    router.replace("/(auth)/login");
  };

  return (
    <SafeAreaView style={styles.container}>
      <Image
        source={sadCat}
        style={{
          width: 250,
          height: 250,
        }}
      />
      <Text style={styles.warringText}>로그인 오류 !</Text>
      <Text style={styles.guideText}>
        로그인 여부를 확인할 수 없어요... {`\n`}다시 시도해주세요!
      </Text>
      <View style={styles.bottomContainer}>
        <Button
          type="default"
          btnTitle="로그인하러 가기"
          onPress={navigationToLogin}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  warringText: {
    fontSize: 32,
    fontFamily: "Pretendard-Bold",
    color: MainColors.danger,
    letterSpacing: -1.2,
    marginBottom: 8,
  },
  guideText: {
    ...FontStyle.contentsText,
    color: GrayColors.black,
    textAlign: "center",
  },
  bottomContainer: {
    width: "100%",
    position: "absolute",
    bottom: 16,
  },
});
