import React from "react";
import { StyleSheet, View, Text } from "react-native";

import { FontStyle } from "@/constants/Font";
import { MainColors, GrayColors } from "@/constants/Colors";
import ModalContainer from "../ModalContainer";
import ModalTextbox from "../ModalTextbox";

type CreateFolderModalProps = {
  visible: boolean;
  onRequestClose: () => void;
  onCreateFolder: () => void;
  folderText: string;
  setFolderText: React.Dispatch<React.SetStateAction<string>>;
  folderDesText: string;
  setFolderDesText: React.Dispatch<React.SetStateAction<string>>;
};

export default function CreateFolderModal({
  visible,
  onRequestClose,
  onCreateFolder,
  folderText,
  setFolderText,
  folderDesText,
  setFolderDesText,
}: CreateFolderModalProps) {
  return (
    <ModalContainer
      visible={visible}
      onRequestClose={onRequestClose}
      onPressBack={onRequestClose}
      title="새 문제 만들기"
      type="back"
      btnTitleLeft="취소"
      btnTitleRight="완료"
      onPressCancle={onRequestClose}
      onPressOk={onCreateFolder}
    >
      <View
        style={{
          marginBottom: 24,
        }}
      >
        <Text
          style={{
            ...FontStyle.textBoxLabel,
            color: GrayColors.black,
            marginBottom: 8,
          }}
        >
          폴더명
        </Text>
        <ModalTextbox
          folderText={folderText}
          placeholder="폴더명을 입력하세요"
          onChangeFolderText={setFolderText}
          onPressClear={() => setFolderText("")}
        />
      </View>
      <View>
        <Text
          style={{
            ...FontStyle.textBoxLabel,
            color: GrayColors.black,
            marginBottom: 8,
          }}
        >
          설명
        </Text>
        <ModalTextbox
          folderText={folderDesText}
          placeholder="문제에 대한 설명을 입력해주세요"
          onChangeFolderText={setFolderDesText}
          onPressClear={() => setFolderDesText("")}
        />
      </View>
    </ModalContainer>
  );
}
