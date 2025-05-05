import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { StyleSheet } from "react-native";
import { View, Text } from "react-native";

import { FontStyle } from "@/constants/Font";
import { MainColors, GrayColors } from "@/constants/Colors";

import Header from "@/components/ui/header";
import Button from "@/components/ui/button/Button";

export default function SignUpStep1() {
  return (
    <SafeAreaView style={styles.container}>
      <Header title="가입 완료" />
      <View style={styles.section}>
        <Text style={styles.title}>회원 가입이{`\n`}완료되었습니다.</Text>
        <Text style={styles.subTitle}>
          Quizlab과 함께 문제 풀이 학습을 시작해보아요!
        </Text>
      </View>
      <View style={styles.bottomContents}>
        <Button
          type="default"
          btnTitle="시작하기"
          onPress={() => {
            router.replace("/(auth)/login");
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
    gap: 16,
  },
  title: {
    ...FontStyle.title,
    color: GrayColors.black,
  },
  subTitle: {
    ...FontStyle.contentsText,
    color: GrayColors.gray30,
  },
  bottomContents: {
    padding: 16,
  },
});
