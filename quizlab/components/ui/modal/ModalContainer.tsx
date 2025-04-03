import React from "react";
import { Modal, ModalBaseProps, StyleSheet } from "react-native";
import { View, Text, TextInput } from "react-native";

import { GrayColors, MainColors } from "@/constants/Colors";
import ModalHeader from "./ModalHeader";
import type { ModalHeaderProps } from "./ModalHeader";
import ModalBtn from "./ModalBtn";
import type { ModalBtnProps } from "./ModalBtn";

export type ModalContainerProps = {
  visible: boolean;
  onRequestClose: () => void;
  children: React.ReactNode;
  btnTitleLeft: string;
  btnTitleRight: string;
} & ModalHeaderProps &
  ModalBtnProps;

export default function ModalContainer({
  visible,
  onRequestClose,
  type,
  title,
  onPressBack,
  onPressExist,
  children,
  btnTitleLeft,
  btnTitleRight,
  onPressOk,
  onPressCancle,
}: ModalContainerProps) {
  return (
    <Modal
      animationType="fade"
      visible={visible}
      transparent={true}
      onRequestClose={onRequestClose}
    >
      <View style={styles.overlay} onTouchEnd={onRequestClose}>
        <View style={styles.container} onTouchEnd={(e) => e.stopPropagation()}>
          <ModalHeader
            type={type}
            title={title}
            onPressBack={onPressBack}
            onPressExist={onPressExist}
          />
          <View style={styles.content}>{children}</View>
          <View style={styles.btnContainer}>
            <View
              style={{
                marginRight: 8,
              }}
            >
              <ModalBtn
                btnType="cancle"
                title={btnTitleLeft}
                onPressCancle={onPressCancle}
              />
            </View>
            <View>
              <ModalBtn
                btnType="default"
                title={btnTitleRight}
                onPressOk={onPressOk}
              />
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 16,
  },
  container: {
    width: "100%",
    backgroundColor: GrayColors.white,
    borderRadius: 16,
    overflow: "hidden",
  },
  content: {
    padding: 24,
  },
  btnContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    paddingHorizontal: 24,
    paddingBottom: 24,
  },
});
