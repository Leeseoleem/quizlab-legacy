import React from "react";
import { Image, StyleSheet, Platform } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { View, Text } from "react-native";
import Header from "@/components/ui/header";

export default function ShareScreen() {
  return (
    <SafeAreaView>
      <Header title="통계" />
    </SafeAreaView>
  );
}
