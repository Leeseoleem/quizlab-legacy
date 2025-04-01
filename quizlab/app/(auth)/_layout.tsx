// app/(auth)/_layout.tsx
import { Stack } from "expo-router";
import { GrayColors } from "@/constants/Colors";

export default function AuthLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: {
          backgroundColor: GrayColors.white, // ✅ 모든 화면 기본 배경 흰색
        },
      }}
    />
  );
}
