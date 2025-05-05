import React, { useState, useEffect, useRef } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { router, useLocalSearchParams } from "expo-router";
import { StyleSheet } from "react-native";
import { View, Text, Animated } from "react-native";
import { TextInput } from "react-native-paper";

import { FontStyle } from "@/constants/Font";
import { MainColors, GrayColors } from "@/constants/Colors";

import { validateEmail } from "@/utils/valid/validateEmail";
import { validatePassword } from "@/utils/valid/validatePassword";
import { signUpWithEmail } from "@/utils/cloud/auth";

import Octicons from "@expo/vector-icons/Octicons";
import Feather from "@expo/vector-icons/Feather";

import Header from "@/components/ui/header";
import Button from "@/components/ui/button/Button";
import showToast from "@/utils/showToast";

export default function SignUpStep1() {
  const { nickname } = useLocalSearchParams();

  const username = nickname as string;

  const [email, setemail] = useState<string>("");

  const [password, setPassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState(false);

  const [confirmPassword, setConfirmPassword] = useState("");
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const isEmailValid = validateEmail(email) === true;
  const isPasswordValid = validatePassword(password) === true;
  const isPasswordMatch = password === confirmPassword;

  const isFormValid = isEmailValid && isPasswordValid && isPasswordMatch;

  // 로딩용
  const [isLoading, setIsLoading] = useState(false);

  const handleSignUp = async () => {
    if (!isFormValid) return;

    try {
      setIsLoading(true);

      const success = await signUpWithEmail({
        email,
        password,
        nickname: username,
      });

      if (success) {
        router.replace("/(auth)/signUpStep3");
      } else {
        showToast("회원가입 중 오류가 발생했어요");
      }
    } catch (error) {
      console.log("에러 발생: " + error);
    } finally {
      setIsLoading(false);
    }
  };

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
        <Text style={styles.title}>계정 정보를 입력해주세요</Text>

        <View
          style={{
            gap: 24,
          }}
        >
          {isPasswordValid && (
            <View
              style={{
                gap: 4,
              }}
            >
              <TextInput
                label="비밀번호 확인"
                value={confirmPassword}
                onChangeText={(text) => setConfirmPassword(text)}
                mode="flat" // 'flat' 또는 'outlined'
                secureTextEntry={!showConfirmPassword}
                right={
                  <TextInput.Icon
                    icon={() =>
                      showConfirmPassword ? (
                        <Feather
                          name="eye"
                          size={20}
                          color={GrayColors.grayHax}
                        />
                      ) : (
                        <Feather
                          name="eye-off"
                          size={20}
                          color={GrayColors.grayHax}
                        />
                      )
                    }
                    onPress={() => setShowConfirmPassword(!showConfirmPassword)}
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
              {password !== confirmPassword && (
                <Text style={styles.validationText}>
                  비밀번호가 일치하지 않습니다.
                </Text>
              )}
            </View>
          )}
          {isEmailValid && (
            <View
              style={{
                gap: 4,
              }}
            >
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
                          size={20}
                          color={GrayColors.grayHax}
                        />
                      ) : (
                        <Feather
                          name="eye-off"
                          size={20}
                          color={GrayColors.grayHax}
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
              {validatePassword(password) && (
                <Text style={styles.validationText}>
                  {validatePassword(password)}
                </Text>
              )}
            </View>
          )}
          <View
            style={{
              gap: 4,
            }}
          >
            <TextInput
              label="이메일"
              value={email}
              onChangeText={(text) => setemail(text)}
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
            {validateEmail(email) && (
              <Text style={styles.validationText}>{validateEmail(email)}</Text>
            )}
          </View>
        </View>
      </View>
      <View style={styles.bottomContents}>
        <Button
          type={!isFormValid ? "non" : "default"}
          btnTitle="다음"
          onPress={handleSignUp}
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
    marginLeft: 8,
    ...FontStyle.bedgeText,
    color: MainColors.primary,
  },
  bottomContents: {
    padding: 16,
  },
});
