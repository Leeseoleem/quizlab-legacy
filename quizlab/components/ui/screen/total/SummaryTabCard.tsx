import React, { useState, useCallback } from "react";
import { useFocusEffect } from "@react-navigation/native";
import { StyleSheet, View, Text, TouchableOpacity } from "react-native";

import { AnimatedCircularProgress } from "react-native-circular-progress";

import { FontStyle } from "@/constants/Font";
import { GrayColors, MainColors } from "@/constants/Colors";

export type SummaryTabCardProps = {
  accuaryTab: boolean;
  SetAccuaryTab: React.Dispatch<React.SetStateAction<boolean>>;
  modeTab: boolean;
  SetModeTab: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function SummaryTabCard({
  accuaryTab,
  SetAccuaryTab,
  modeTab,
  SetModeTab,
}: SummaryTabCardProps) {
  return (
    <View style={styles.container}>
      <View style={styles.tabHeader}>
        <TabHeader
          title="정확도"
          focus={accuaryTab}
          onPress={() => {
            SetAccuaryTab(true);
            SetModeTab(false);
          }}
        />
        <TabHeader
          title="풀이 방식"
          focus={modeTab}
          onPress={() => {
            SetAccuaryTab(false);
            SetModeTab(true);
          }}
        />
      </View>
      <View></View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 8,
    borderWidth: 1,
    borderColor: GrayColors.gray20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  tabHeader: {
    flexDirection: "row",
  },
});

const TabHeader = ({
  title,
  onPress,
  focus,
}: {
  title: string;
  onPress: () => void;
  focus: boolean;
}) => {
  return (
    <TouchableOpacity
      style={[
        tabStyles.container,
        {
          borderBottomColor: focus ? MainColors.primary : GrayColors.gray20,
        },
      ]}
      activeOpacity={0.8}
      onPress={onPress}
    >
      <Text
        style={[
          tabStyles.title,
          {
            color: focus ? MainColors.primary : GrayColors.gray20,
          },
        ]}
      >
        {title}
      </Text>
    </TouchableOpacity>
  );
};

const tabStyles = StyleSheet.create({
  container: {
    flex: 1,
    borderRadius: 8,
    borderBottomWidth: 2,
  },
  title: {
    ...FontStyle.subTitle,
  },
});
