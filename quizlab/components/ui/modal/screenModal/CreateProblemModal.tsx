import React, { useRef } from "react";
import { Dimensions } from "react-native";
import { StyleSheet, View, Text, TouchableOpacity } from "react-native";
import {
  ScrollView,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from "react-native";

import ModalLargeTextbox from "../ModalLargeTextBox";
import { SecondRoute, SecondRouteProps } from "./tabScreen/SecondRoute";

const SCREEN_WIDTH = Dimensions.get("window").width;
const TAB_WIDTH = SCREEN_WIDTH - 80;

import { MainColors, GrayColors } from "@/constants/Colors";

import ModalContainer from "../ModalContainer";

type CreateProblemModalProps = {
  visible: boolean;
  onRequestClose: () => void;
  onCreateProblem: () => void;
  type: MyType;
  setType: React.Dispatch<React.SetStateAction<MyType>>;
  scrollRef: React.RefObject<ScrollView>;
};

export type MyType = "descriptive" | "choice";

export default function CreateProblemModal({
  visible,
  onRequestClose,
  onCreateProblem,
  type,
  setType,
  scrollRef,
  problemText,
  setProblemText,
  answerText,
  setAnswerText,
  onAddProblem,
  // 선택형
  option,
  handleTextChange,
  checkAnswer,
  onRemove,
  scrollListRef,
}: CreateProblemModalProps & FirstRouteProps & SecondRouteProps) {
  // 탭 버튼 클릭 시 실행
  const handleTabPress = (selected: MyType) => {
    setType(selected); // 탭 상태 업데이트
    scrollRef.current?.scrollTo({
      x: selected === "descriptive" ? 0 : TAB_WIDTH, // 탭에 맞는 위치로 이동
      animated: true,
    });
  };

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const offsetX = event.nativeEvent.contentOffset.x;
    const index = Math.round(offsetX / TAB_WIDTH); // 페이지 인덱스 계산
    setType(index === 0 ? "descriptive" : "choice"); // 탭 상태 반영
  };

  return (
    <ModalContainer
      visible={visible}
      onRequestClose={onRequestClose}
      type="back"
      title="문제 추가하기"
      onPressBack={onRequestClose}
      btnTitleLeft="취소"
      onPressCancle={onRequestClose}
      btnTitleRight="완료"
      onPressOk={onCreateProblem}
    >
      <View>
        <View
          style={{
            flexDirection: "row",
          }}
        >
          <TouchableOpacity
            style={[
              styles.barStyle,
              {
                borderBottomWidth: 2,
                borderColor:
                  type === "descriptive" ? MainColors.primary : "transparent",
              },
            ]}
            onPress={() => handleTabPress("descriptive")}
          >
            <Text
              style={[
                styles.barText,
                {
                  color:
                    type === "descriptive"
                      ? GrayColors.black
                      : GrayColors.gray20,
                },
              ]}
            >
              서술형
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.barStyle,
              {
                borderBottomWidth: 2,
                borderColor:
                  type === "choice" ? MainColors.primary : "transparent",
              },
            ]}
            onPress={() => handleTabPress("choice")}
          >
            <Text
              style={[
                styles.barText,
                {
                  color:
                    type === "choice" ? GrayColors.black : GrayColors.gray20,
                },
              ]}
            >
              선택형
            </Text>
          </TouchableOpacity>
        </View>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          pagingEnabled
          ref={scrollRef}
          onScroll={handleScroll}
          scrollEventThrottle={16}
          style={{ width: TAB_WIDTH }}
          contentContainerStyle={{
            flexDirection: "row",
          }} // 내부 정렬
        >
          <View
            style={[
              styles.tabPage,
              {
                width: TAB_WIDTH,
              },
            ]}
          >
            <FirstRoute
              problemText={problemText}
              setProblemText={setProblemText}
              answerText={answerText}
              setAnswerText={setAnswerText}
            />
          </View>
          <View style={[styles.tabPage, { width: TAB_WIDTH }]}>
            <SecondRoute
              problemText={problemText}
              setProblemText={setProblemText}
              onAddProblem={onAddProblem}
              option={option}
              handleTextChange={handleTextChange}
              checkAnswer={checkAnswer}
              onRemove={onRemove}
              scrollListRef={scrollListRef}
            />
          </View>
        </ScrollView>
      </View>
    </ModalContainer>
  );
}

type FirstRouteProps = {
  problemText: string;
  setProblemText: React.Dispatch<React.SetStateAction<string>>;
  answerText: string;
  setAnswerText: React.Dispatch<React.SetStateAction<string>>;
};

const FirstRoute = ({
  problemText,
  setProblemText,
  answerText,
  setAnswerText,
}: FirstRouteProps) => (
  <View style={tabStyles.contanier}>
    <ModalLargeTextbox
      label="문제"
      placeholder="문제를 입력하세요"
      text={problemText}
      onChangetText={setProblemText}
    />
    <View
      style={{
        height: 16,
      }}
    />
    <ModalLargeTextbox
      label="정답"
      placeholder="정답을 입력하세요"
      text={answerText}
      onChangetText={setAnswerText}
    />
  </View>
);

const styles = StyleSheet.create({
  scrollContianer: {
    flex: 1,
    width: "100%",
  },
  tabBar: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  barStyle: {
    width: "50%",
    height: 42,
    paddingVertical: 8,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "flex-end",
  },
  barText: {
    fontFamily: "Pretendard-Medium",
    fontSize: 12,
  },
  tabPage: {},
});

const tabStyles = StyleSheet.create({
  contanier: {
    paddingTop: 24,
  },
  addBtn: {
    height: 46,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: GrayColors.gray20,
  },
  btnTitle: {
    marginLeft: 4,
    fontFamily: "Pretendard-Medium",
    fontSize: 12,
    color: GrayColors.black,
  },
});
