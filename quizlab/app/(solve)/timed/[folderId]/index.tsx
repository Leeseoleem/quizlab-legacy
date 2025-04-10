import React, { useCallback, useEffect, useMemo, useRef } from "react";
import { router, useLocalSearchParams, useFocusEffect } from "expo-router";

import { View, Text, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import Header from "@/components/ui/header";

export default function TimedScreen() {
  const { folderId, mode, hour, minute } = useLocalSearchParams();

  return (
    <SafeAreaView style={styles.container}>
      <Header
        title="받아올 타이틀"
        showBack={true}
        onPressBack={() => router.push(`/problem/${folderId}`)}
        rightIcon={mode === "timed" ? "time" : undefined}
        timeText="timeText"
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    flex: 1,
    padding: 36,
    alignItems: "center",
  },
});
