import { SafeAreaView } from "react-native-safe-area-context";
import { StyleSheet, View, Text } from "react-native";

import Header from "@/components/ui/header";

import { router, useLocalSearchParams } from "expo-router";

export default function TotalDetailScreen() {
  const { forderId, title } = useLocalSearchParams();
  return (
    <SafeAreaView>
      <Header
        title={title as string}
        showBack={true}
        onPressBack={() => {
          router.back();
        }}
      />
    </SafeAreaView>
  );
}
