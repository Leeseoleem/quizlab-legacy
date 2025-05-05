import React from "react";
import { useState, useEffect } from "react";
import { router } from "expo-router";

import { SafeAreaView } from "react-native-safe-area-context";
import { StyleSheet, View, Text, Image, TouchableOpacity } from "react-native";
import { TextInput } from "react-native-paper";

import { GrayColors, MainColors } from "@/constants/Colors";
import Feather from "@expo/vector-icons/Feather";

import Header from "@/components/ui/header";
import Button from "@/components/ui/button/Button";
import mainLogo from "@/assets/images/mainLogoColor.png";
import showToast from "@/utils/showToast";

import { loginWithEmail } from "@/utils/auth";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    setEmail("");
    setPassword("");
    setShowPassword(false);
  }, []);

  const handleLogin = async () => {
    if (email === "" || password === "") return;
    const result = await loginWithEmail(email.trim(), password.trim());
    if (result.success) {
      router.push("/(tabs)");
      showToast("로그인 되었습니다");
      // 로그인 성공 시 자동으로 onAuthStateChanged에 의해 화면 전환됨
    } else {
      showToast("로그인 중 오류가 발생하였습니다");
      console.error(result.error);
    }
  };

  return (
    <SafeAreaView>
      <Header
        title="로그인하기"
        showBack={true}
        onPressBack={() => router.back()}
      />
      <View style={styles.mainContents}>
        <View style={styles.logoContents}>
          <Image
            source={mainLogo}
            style={{
              width: 80,
              height: 80,
              marginRight: 16,
            }}
          />
          <Text style={styles.mainTitle}>Quiz Lab</Text>
        </View>
        <View
          style={{
            marginVertical: 60,
          }}
        >
          <View
            style={{
              marginBottom: 16,
            }}
          >
            <TextInput
              label="이메일 주소"
              value={email}
              onChangeText={(text) => setEmail(text)}
              mode="flat" // 'flat' 또는 'outlined'
              underlineColor={MainColors.secondary}
              activeUnderlineColor={MainColors.primary}
              style={{
                backgroundColor: GrayColors.white,
                fontFamily: "Pretendard-Medium",
              }}
              theme={{
                colors: {
                  primary: MainColors.primary, // 라벨 활성화 색상
                  text: GrayColors.black, // 입력 텍스트 색상
                  placeholder: GrayColors.gray20, // 라벨 비활성화 색상
                },
              }}
            />
          </View>
          <View>
            <TextInput
              label="비밀번호"
              value={password}
              onChangeText={(text) => setPassword(text)}
              mode="flat" // 'flat' 또는 'outlined'
              secureTextEntry={!showPassword}
              right={
                <TextInput.Icon
                  icon={() =>
                    showPassword ? (
                      <Feather
                        name="eye"
                        size={24}
                        color={MainColors.primary}
                      />
                    ) : (
                      <Feather
                        name="eye-off"
                        size={24}
                        color={MainColors.primary}
                      />
                    )
                  }
                  onPress={() => setShowPassword(!showPassword)}
                />
              }
              underlineColor={MainColors.secondary}
              activeUnderlineColor={MainColors.primary}
              style={{
                backgroundColor: GrayColors.white,
                fontFamily: "Pretendard-Medium",
              }}
              theme={{
                colors: {
                  primary: MainColors.primary, // 라벨 활성화 색상
                  text: GrayColors.black, // 입력 텍스트 색상
                  placeholder: GrayColors.gray20, // 라벨 비활성화 색상
                },
              }}
            />
          </View>
        </View>
        {email === "" || password === "" ? (
          <Button btnTitle="로그인" type="non" />
        ) : (
          <Button btnTitle="로그인" type="default" onPress={handleLogin} />
        )}
        <View style={styles.bottomText}>
          <Text style={styles.textDes}>아직 회원이 아니신가요?</Text>
          <TouchableOpacity onPress={() => router.push("/(auth)/signUpStep1")}>
            <Text style={styles.textSignup}>회원가입</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  mainContents: {
    paddingHorizontal: 16,
  },
  logoContents: {
    marginTop: 60,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  mainTitle: {
    fontFamily: "Cafe24Danjunghae",
    fontSize: 36,
    letterSpacing: -1.2,
    color: GrayColors.black,
    marginBottom: 12,
  },
  subTitle: {
    fontFamily: "Pretendard-Regular",
    letterSpacing: -0.4,
    color: GrayColors.black,
  },
  bottomContents: {
    width: "100%",
    position: "absolute",
    bottom: 16,
  },
  bottomText: {
    marginTop: 16,
    flexDirection: "row",
    justifyContent: "center",
  },
  textDes: {
    fontFamily: "Pretendard-Regular",
    fontSize: 12,
    color: GrayColors.gray40,
    letterSpacing: -0.4,
    marginRight: 4,
  },
  textSignup: {
    fontFamily: "Pretendard-SemiBold",
    fontSize: 12,
    color: MainColors.primary,
    letterSpacing: -0.4,
  },
});
