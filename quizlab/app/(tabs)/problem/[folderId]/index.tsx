import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { StyleSheet } from "react-native";
import { View, FlatList } from "react-native";
import { useLocalSearchParams, Link, router } from "expo-router";

import safeParam from "@/utils/params";

import Header from "@/components/ui/header";
import ProblemDetailList from "@/components/ui/list/ProblemDetailList";
import Button from "@/components/ui/button/Button";
import { MainColors } from "@/constants/Colors";

export default function FolderDetailScreen() {
  const { folderId, title } = useLocalSearchParams();

  const propblemListData = [
    {
      id: 1,
      type: "descriptive",
      questionTitle: "문제는?",
      answerTitle: "문제",
    },
    {
      id: 2,
      type: "descriptive",
      questionTitle: "문제는?",
      answerTitle: "문제",
    },
    {
      id: 3,
      type: "choice",
      questionTitle: "문제는?",
      answerTitle: "문제",
    },
    {
      id: 4,
      type: "descriptive",
      questionTitle: "문제는?",
      answerTitle: "문제",
    },
    {
      id: 5,
      type: "descriptive",
      questionTitle: "문제는?",
      answerTitle: "문제",
    },
  ];
  return (
    <SafeAreaView style={styles.container}>
      <Header
        title={safeParam(title)}
        showBack={true}
        rightIcon="edit"
        onPressBack={() => router.back()}
      />
      <View style={styles.contents}>
        <FlatList
          showsVerticalScrollIndicator={false}
          data={propblemListData}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View
              style={{
                marginBottom: 16,
              }}
            >
              <ProblemDetailList
                type={item.type as "descriptive" | "choice"}
                questionTitle={item.questionTitle}
                answerTitle={item.answerTitle}
              />
            </View>
          )}
        />
        <View>
          <View
            style={{
              marginBottom: 16,
            }}
          >
            <Button
              type="add"
              onPress={() => {
                console.log("항");
              }}
            />
          </View>
          <View>
            <Button
              type="default"
              btnTitle="문제 풀기"
              onPress={() => {
                console.log("항");
              }}
            />
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    backgroundColor: MainColors.primaryForeground,
  },
  contents: {
    flex: 1,
    padding: 16,
    justifyContent: "space-between",
  },
});
