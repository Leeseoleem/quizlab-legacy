import React from "react";
import { Image, StyleSheet, Platform } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { View, Text } from "react-native";

export default function RecordScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <Text>기록 화면</Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
