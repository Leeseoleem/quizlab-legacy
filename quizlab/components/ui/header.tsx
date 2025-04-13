import React from "react";
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  StyleProp,
  TextStyle,
} from "react-native";
import { TouchableOpacity } from "react-native";

import { GestureResponderEvent, ViewStyle } from "react-native";

import { GrayColors } from "@/constants/Colors";
import { FontStyle } from "@/constants/Font";
import Feather from "@expo/vector-icons/Feather";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";

type HeaderProps = {
  title: string;
  showBack?: boolean;
  rightIcon?: "search" | "edit" | "menu" | "time";
  clockColor?: string;
  timeText?: string;
  timetextStyle?: StyleProp<TextStyle>;
  onPressBack?: (event: GestureResponderEvent) => void;
  onPressSearch?: (event: GestureResponderEvent) => void;
  onPressEndearch?: (event: GestureResponderEvent) => void;
  onPressEdit?: (event: GestureResponderEvent) => void;
  onPressMenu?: (event: GestureResponderEvent) => void;
  // 검색창 모드 여부
  isSearchMode?: boolean;
  onChangeSearchText?: (text: string) => void;
  searchText?: string;
  onPressClearSearch?: (event: GestureResponderEvent) => void; // 검색칭 제거
};

export default function Header({
  title,
  showBack,
  rightIcon,
  clockColor,
  timeText,
  timetextStyle,
  onPressBack,
  onPressSearch,
  onPressEndearch,
  onPressEdit,
  onPressMenu,
  // search header
  isSearchMode,
  onChangeSearchText,
  searchText,
  onPressClearSearch,
}: HeaderProps) {
  return (
    <View style={styles.header}>
      <View style={styles.left}>
        {showBack && (
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={onPressBack}
            style={{
              marginRight: 24,
            }}
          >
            <Feather name="arrow-left" size={24} color={GrayColors.black} />
          </TouchableOpacity>
        )}
        {isSearchMode ? (
          <View
            style={{
              flex: 1,
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <TextInput
              style={{
                ...styles.searchInput,
                borderColor: searchText ? GrayColors.black : GrayColors.grayHax,
              }}
              placeholder="검색어를 입력하세요"
              value={searchText}
              onChangeText={onChangeSearchText}
              multiline={false}
              numberOfLines={1}
            />
            {searchText && (
              <Feather
                name="x-circle"
                size={18}
                color={GrayColors.black}
                style={{
                  position: "absolute",
                  right: 16,
                }}
                onPress={onPressClearSearch}
              />
            )}
          </View>
        ) : (
          <Text style={styles.title} numberOfLines={1}>
            {title}
          </Text>
        )}
      </View>
      <View style={styles.right}>
        {rightIcon === "search" &&
          (isSearchMode ? (
            <TouchableOpacity activeOpacity={0.8} onPress={onPressEndearch}>
              <Feather name="x" size={24} color={GrayColors.black} />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity activeOpacity={0.8} onPress={onPressSearch}>
              <Feather name="search" size={24} color={GrayColors.black} />
            </TouchableOpacity>
          ))}
        {rightIcon === "edit" && (
          <TouchableOpacity activeOpacity={0.8}>
            <MaterialCommunityIcons
              name="pencil-outline"
              size={24}
              color={GrayColors.black}
            />
          </TouchableOpacity>
        )}
        {rightIcon === "menu" && (
          <TouchableOpacity activeOpacity={0.8}>
            <Feather name="more-vertical" size={24} color={GrayColors.black} />
          </TouchableOpacity>
        )}
        {rightIcon === "time" && (
          <View style={styles.timeFram}>
            <Feather name="clock" size={24} color={clockColor} />
            <Text style={[styles.timeText, timetextStyle]}>{timeText}</Text>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    height: 64,
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
  },
  left: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },
  right: {
    paddingLeft: 16,
    flexDirection: "row",
    alignItems: "center",
  },
  title: {
    color: GrayColors.black,
    ...FontStyle.title,
    flexShrink: 1,
    flexWrap: "wrap",
  },
  timeFram: {
    flexDirection: "row",
    justifyContent: "center",
  },
  timeText: {
    marginLeft: 8,
    fontFamily: "Pretendard-Regular",
    color: GrayColors.gray30,
  },
  searchInput: {
    flex: 1,
    paddingLeft: 16,
    paddingRight: 50,
    paddingVertical: 8,
    borderWidth: 1,
    borderRadius: 8,
  },
});
