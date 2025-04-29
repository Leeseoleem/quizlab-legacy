import React from "react";
import { View, Text } from "react-native";

import ModalContainer from "../ModalContainer";
import { FontStyle } from "@/constants/Font";
import { GrayColors } from "@/constants/Colors";

type SecessionModalProps = {
  visible: boolean;
  onRequestClose: () => void;
  onPressOk: () => void;
};

export default function SecessionModal({
  visible,
  onRequestClose,
  onPressOk,
}: SecessionModalProps) {
  return (
    <ModalContainer
      visible={visible}
      onRequestClose={onRequestClose}
      onPressOk={onPressOk}
      onPressCancle={onRequestClose}
      type="simple"
      title="정말 탈퇴하시겠습니까?"
      btnTitleLeft="취소"
      btnTitleRight="탈퇴"
    >
      <View
        style={{
          marginVertical: 8,
        }}
      >
        <Text
          style={{
            ...FontStyle.contentsText,
            color: GrayColors.gray40,
          }}
        >
          탈퇴 시 작성하신 내용은 모두 삭제되며 {`\n`}복구되지 않습니다.
        </Text>
      </View>
    </ModalContainer>
  );
}
