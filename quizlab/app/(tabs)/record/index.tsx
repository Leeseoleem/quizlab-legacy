import React, { useCallback, useMemo, useRef } from "react";
import { View, Text, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import Header from "@/components/ui/header";

export default function RecordScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <Header title="기록" />
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
