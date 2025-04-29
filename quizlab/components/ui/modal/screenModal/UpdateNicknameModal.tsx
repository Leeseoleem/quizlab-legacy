import React from "react";
import { Text, View } from "react-native";

import ModalContainer from "../ModalContainer";
import ModalTextbox from "../ModalTextbox";

import { GrayColors, MainColors } from "@/constants/Colors";
import { FontStyle } from "@/constants/Font";

type UpdateNicknameModalProps = {
  visible: boolean;
  closeModal: () => void;
  handleChangeNickname: () => void;
  folderText: string;
  onChangeFolderText: (text: string) => void;
  onPressClear: () => void;
};

export default function UpdateNicknameModal({
  visible,
  closeModal,
  handleChangeNickname,
  folderText,
  onChangeFolderText,
  onPressClear,
}: UpdateNicknameModalProps) {
  return (
    <ModalContainer
      visible={visible}
      onRequestClose={closeModal}
      type="back"
      title="닉네임 수정하기"
      onPressBack={closeModal}
      btnTitleLeft="취소"
      btnTitleRight="수정하기"
      onPressOk={handleChangeNickname}
      onPressCancle={closeModal}
    >
      <View>
        <Text
          style={{
            ...FontStyle.textBoxLabel,
            color: GrayColors.black,
            marginBottom: 8,
          }}
        >
          닉네임
        </Text>
        <ModalTextbox
          folderText={folderText}
          placeholder="닉네임을 입력하세요 (최대 12자)"
          onChangeFolderText={onChangeFolderText}
          onPressClear={onPressClear}
          maxLength={12}
        />
      </View>
    </ModalContainer>
  );
}
