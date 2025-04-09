import { useEffect } from "react";
import { View, Text, FlatList, StyleSheet } from "react-native";

import { GrayColors, MainColors } from "@/constants/Colors";
import { FontStyle } from "@/constants/Font";
import ModalContainer from "../ModalContainer";

import { hours, minutes } from "@/utils/timeData";
import { router } from "expo-router";

type SettingTimeProps = {
  visible: boolean;
  onRequestClose: () => void;
  onPressExist: () => void;
  onStart: () => void;
  selectHourIndex: number;
  hourFlatListRef: React.RefObject<FlatList>;
  onHourChange: (index: number) => void;
  selectMinutesIndex: number;
  onMinutesChange: (index: number) => void;
  minuteFlatList: React.RefObject<FlatList>;
};

export default function SettingTimeModal({
  visible,
  onRequestClose,
  onPressExist,
  onStart,
  selectHourIndex,
  onHourChange,
  hourFlatListRef,
  onMinutesChange,
  selectMinutesIndex,
  minuteFlatList,
}: SettingTimeProps) {
  return (
    <ModalContainer
      visible={visible}
      onRequestClose={onRequestClose}
      type="exist"
      title="시간 제한 모드"
      onPressExist={onPressExist}
      btnTitleLeft="취소"
      btnTitleRight="시작"
      onPressCancle={onRequestClose}
      onPressOk={onStart}
    >
      <View>
        <Text style={styles.title}>풀이 시간을 설정해주세요</Text>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "center",
            padding: 24,
            marginTop: 12,
          }}
        >
          <View
            style={{
              flex: 1,
              alignItems: "center",
            }}
          >
            <Text style={styles.timeTitle}>시간</Text>
            <ScrollPicker
              data={hours}
              selectedIndex={selectHourIndex}
              onchange={onHourChange}
              flatListRef={hourFlatListRef}
            />
          </View>
          <View
            style={{
              flex: 1,
              alignItems: "center",
            }}
          >
            <Text style={styles.timeTitle}>분</Text>
            <ScrollPicker
              data={minutes}
              selectedIndex={selectMinutesIndex}
              onchange={onMinutesChange}
              flatListRef={minuteFlatList}
            />
          </View>
        </View>
      </View>
    </ModalContainer>
  );
}
type ScollPicker = {
  data: string[];
  selectedIndex: number;
  itemHeight?: number;
  onchange: (index: number) => void;
  flatListRef: React.RefObject<FlatList>;
};

export const scrollToIndex = (
  index: number,
  flatListRef: React.RefObject<FlatList>,
  itemHeight: number
) => {
  // scrollToOffset: FlatList를 offset 위치로 이동
  flatListRef.current?.scrollToOffset({
    offset: index * itemHeight,
    animated: true, // 애니메이션 효과와 함께 이동
  });
};

const ScrollPicker = ({
  data,
  selectedIndex,
  itemHeight = 40,
  onchange,
  flatListRef,
}: ScollPicker) => {
  const visibleCount = 3;
  const centerOffset = itemHeight * Math.floor(visibleCount / 2);

  return (
    <FlatList
      ref={flatListRef}
      data={data}
      keyExtractor={(item) => item}
      bounces={false}
      showsVerticalScrollIndicator={false}
      snapToInterval={itemHeight}
      decelerationRate="fast"
      onMomentumScrollEnd={(e) => {
        const offsetY = e.nativeEvent.contentOffset.y + centerOffset;
        const index = Math.round(offsetY / itemHeight) - 1;
        onchange(index); // ✅ 화면 중앙에 온 항목으로 선택 처리
        console.log(index);
      }}
      getItemLayout={(_, index) => ({
        length: itemHeight,
        offset: itemHeight * index,
        index,
      })}
      contentContainerStyle={{ paddingVertical: itemHeight }} // ✅ 중앙 맞추기
      style={{ height: itemHeight * visibleCount }}
      renderItem={({ item, index }) => (
        <View style={[pickerStyles.item, { height: itemHeight }]}>
          <Text
            style={
              index === selectedIndex
                ? pickerStyles.selectedText
                : pickerStyles.text
            }
          >
            {item}
          </Text>
        </View>
      )}
    />
  );
};

const styles = StyleSheet.create({
  title: {
    ...FontStyle.subTitle,
    color: GrayColors.black,
  },
  timeTitle: {
    ...FontStyle.textBoxLabel,
    color: GrayColors.black,
    marginBottom: 8,
  },
});

const pickerStyles = StyleSheet.create({
  item: {
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    fontFamily: "Pretendard-SemiBold",
    color: GrayColors.gray20,
    fontSize: 20,
  },
  selectedText: {
    fontFamily: "Pretendard-SemiBold",
    color: GrayColors.black,
    fontSize: 24,
  },
});
