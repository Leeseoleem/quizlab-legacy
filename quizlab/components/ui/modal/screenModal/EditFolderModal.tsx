import React from "react";
import { View, Text } from "react-native";
import { StyleSheet } from "react-native";

import ModalContainer from "../ModalContainer";
import ModalTextbox from "../ModalTextbox";

import { GrayColors, MainColors } from "@/constants/Colors";
import { FontStyle } from "@/constants/Font";

type EditFolderModalProps = {
  visible: boolean;
  onRequestClose: () => void;
  onEditFolder: () => void;
  folderEditText: string;
  setFolderEditText: React.Dispatch<React.SetStateAction<string>>;
  folderEditDesText: string;
  setFolderEditDesText: React.Dispatch<React.SetStateAction<string>>;
};

export default function EditFolderModal({
  visible,
  onRequestClose,
  onEditFolder,
  folderEditText,
  setFolderEditText,
  folderEditDesText,
  setFolderEditDesText,
}: EditFolderModalProps) {
  return (
    <ModalContainer
      visible={visible}
      onRequestClose={onRequestClose}
      onPressBack={onRequestClose}
      title="수정하기"
      type="back"
      btnTitleLeft="취소"
      btnTitleRight="완료"
      onPressCancle={onRequestClose}
      onPressOk={onEditFolder}
    >
      <View
        style={{
          marginBottom: 24,
        }}
      >
        <Text style={styles.label}>폴더명</Text>
        <ModalTextbox
          folderText={folderEditText}
          placeholder="폴더명을 입력하세요"
          onChangeFolderText={setFolderEditText}
          onPressClear={() => setFolderEditText("")}
        />
      </View>
      <View>
        <Text style={styles.label}>설명</Text>
        <ModalTextbox
          folderText={folderEditDesText}
          placeholder="문제에 대한 설명을 입력해주세요"
          onChangeFolderText={setFolderEditDesText}
          onPressClear={() => setFolderEditDesText("")}
        />
      </View>
    </ModalContainer>
  );
}

const styles = StyleSheet.create({
  label: {
    ...FontStyle.textBoxLabel,
    color: GrayColors.black,
    marginBottom: 8,
  },
});
