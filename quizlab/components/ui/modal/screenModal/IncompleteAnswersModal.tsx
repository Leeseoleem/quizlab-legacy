import React from "react";
import { View, Text } from "react-native";
import ModalContainer from "../ModalContainer";
import { FontStyle } from "@/constants/Font";
import { GrayColors } from "@/constants/Colors";

type IncompleteAnswersProps = {
  visible: boolean;
  onRequestClose: () => void;
  onPressOk: () => void;
};

export const IncompleteAnswersModal = ({
  visible,
  onRequestClose,
  onPressOk,
}: IncompleteAnswersProps) => {
  return (
    <ModalContainer
      title="제출 전 확인이 필요합니다"
      visible={visible}
      onRequestClose={onRequestClose}
      type="back"
      onPressBack={onRequestClose}
      btnTitleLeft="취소"
      btnTitleRight="제출하기"
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
          아직 풀지 않은 문제가 있습니다.{`\n`}정말 제출하시겠습니까?
        </Text>
      </View>
    </ModalContainer>
  );
};
