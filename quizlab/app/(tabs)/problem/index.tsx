import React from "react";
import { useState, useEffect } from "react";
import { Image, StyleSheet, Platform, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { View, Text } from "react-native";

import { GrayColors, MainColors } from "@/constants/Colors";
import { FontStyle } from "@/constants/Font";

import Header from "@/components/ui/header";

export default function ProblemScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <Header title="문제" />
      <View style={styles.contents}>
        <Text>하이</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
  },
  contents: {
    flex: 1,
    paddingHorizontal: 16,
  },
});
