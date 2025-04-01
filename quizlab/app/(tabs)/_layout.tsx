import { Tabs, useNavigationContainerRef } from "expo-router";
import { useNavigationState } from "@react-navigation/native";
import React from "react";
import { Platform, Pressable } from "react-native";

import Feather from "@expo/vector-icons/Feather";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import TabBarBackground from "@/components/ui/TabBarBackground";
import { GrayColors, MainColors } from "@/constants/Colors";

export default function TabLayout() {
  const navigationRef = useNavigationContainerRef();
  const state = useNavigationState((state) => state);

  return (
    <Tabs
      screenOptions={({ route }) => ({
        tabBarActiveTintColor: MainColors.primary,
        tabBarInactiveTintColor: GrayColors.gray20,
        headerShown: false,
        tabBarButton: (props) => <Pressable {...props} android_ripple={null} />,
        tabBarBackground: TabBarBackground,
        tabBarStyle: {
          ...Platform.select({
            ios: {
              // Use a transparent background on iOS to show the blur effect
              position: "absolute",
            },
            default: {},
          }),
        },
      })}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "홈",
          tabBarIcon: ({ color }) => (
            <Feather name="home" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="problem"
        options={{
          title: "문제",
          tabBarIcon: ({ color }) => (
            <Feather name="folder-plus" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="record"
        options={{
          title: "기록",
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons
              name="pencil-outline"
              size={24}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="share"
        options={{
          title: "공유",
          tabBarIcon: ({ color }) => (
            <Feather name="share" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="setting"
        options={{
          title: "설정",
          tabBarIcon: ({ color }) => (
            <Feather name="settings" size={24} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
