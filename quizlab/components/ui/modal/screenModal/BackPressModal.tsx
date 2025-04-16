import React from "react";
import { View, Text } from "react-native";
import ModalContainer from "../ModalContainer";
import { FontStyle } from "@/constants/Font";
import { GrayColors } from "@/constants/Colors";

type BackProps = {
  visible: boolean;
  onRequestClose: () => void;
  onPressOk: () => void;
};

export const BackPressModal = ({
  visible,
  onRequestClose,
  onPressOk,
}: BackProps) => {
  return (
    <ModalContainer
      title="정말 종료하시겠습니까?"
      visible={visible}
      onRequestClose={onRequestClose}
      type="back"
      onPressBack={onRequestClose}
      btnTitleLeft="취소"
      btnTitleRight="나가기"
      onPressCancle={onRequestClose}
      onPressOk={onPressOk}
    >
      <View
        style={{
          marginVertical: 8,
        }}
      >
        <Text
          style={{
            ...FontStyle.contentsText,
            color: GrayColors.black,
          }}
        >
          지금 나가면 풀이 정보는 저장되지 않습니다.{`\n`}정말 나가시겠습니까?
        </Text>
      </View>
    </ModalContainer>
  );
};
