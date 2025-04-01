import React from "react";
import { Stack } from "expo-router";
import { GrayColors } from "@/constants/Colors";

export default function ShareLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false, // ✅ Stack 내부 헤더 숨기기
        contentStyle: {
          backgroundColor: GrayColors.white, // ✅ 모든 화면 기본 배경 흰색
        },
      }}
    />
  );
}
