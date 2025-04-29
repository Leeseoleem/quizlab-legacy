import { Tabs, useNavigationContainerRef } from "expo-router";
import { useNavigationState, Route } from "@react-navigation/native";
import React, { useRef } from "react";
import { Platform, Pressable } from "react-native";

import Feather from "@expo/vector-icons/Feather";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import TabBarBackground from "@/components/ui/TabBarBackground";
import { GrayColors, MainColors } from "@/constants/Colors";

export default function TabLayout() {
  const navigationRef = useNavigationContainerRef();
  const state = useNavigationState((state) => state);
  const tabNavigationRefs = useRef<{ [key: string]: any }>({});

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
        listeners={({ navigation, route }) => ({
          tabPress: (e) => {
            const state = navigation.getState();

            const tab = state.routes.find(
              (r: Route<string>) => r.key === route.key
            );
            if (tab && tab.state?.index > 0) {
              // 현재 탭의 스택이 루트가 아니면 popToTop
              navigation.navigate(route.name); // 또는 navigation.popToTop() - 사용하려면 Stack 사용 필요
            }
          },
        })}
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
        listeners={({ navigation, route }) => ({
          tabPress: (e) => {
            const state = navigation.getState();

            const tab = state.routes.find(
              (r: Route<string>) => r.key === route.key
            );
            if (tab && tab.state?.index > 0) {
              // 현재 탭의 스택이 루트가 아니면 popToTop
              navigation.navigate(route.name); // 또는 navigation.popToTop() - 사용하려면 Stack 사용 필요
            }
          },
        })}
      />
      <Tabs.Screen
        name="share"
        options={{
          title: "통계",
          tabBarIcon: ({ color }) => (
            <Feather name="bar-chart" size={24} color={color} />
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
        listeners={({ navigation, route }) => ({
          tabPress: (e) => {
            const state = navigation.getState();

            const tab = state.routes.find(
              (r: Route<string>) => r.key === route.key
            );
            if (tab && tab.state?.index > 0) {
              // 현재 탭의 스택이 루트가 아니면 popToTop
              navigation.navigate(route.name); // 또는 navigation.popToTop() - 사용하려면 Stack 사용 필요
            }
          },
        })}
      />
    </Tabs>
  );
}
