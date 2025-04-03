import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { StyleSheet } from "react-native";
import { View, Text } from "react-native";

export default function SignUpStep1() {
  return (
    <SafeAreaView style={styles.container}>
      <View>
        <Text>하이</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
