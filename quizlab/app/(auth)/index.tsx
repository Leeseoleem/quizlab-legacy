import React, { useState, useEffect } from "react";
import { StyleSheet, View, Text, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";

import mainLogo from "@/assets/images/mainCat.png";
import Button from "@/components/ui/button/Button";

import { GrayColors } from "@/constants/Colors";

export default function StartScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.logoContents}>
        <Image
          source={mainLogo}
          style={{
            width: 250,
            height: 250,
          }}
        />
        <Text style={styles.mainTitle}>Quiz Lab</Text>
        <Text style={styles.subTitle}>나만의 문제집,한 문제씩 차근차근</Text>
      </View>
      <View style={styles.bottomContents}>
        <Button
          btnTitle="시작하기"
          type="default"
          onPress={() => router.push("/login")}
        />
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
  logoContents: {
    justifyContent: "center",
    alignItems: "center",
  },
  mainTitle: {
    fontFamily: "Cafe24Danjunghae",
    fontSize: 64,
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
});
