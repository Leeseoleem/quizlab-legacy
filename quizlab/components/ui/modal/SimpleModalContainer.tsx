import { View, Text, Modal } from "react-native";
import { StyleSheet } from "react-native";

import { GrayColors, MainColors } from "@/constants/Colors";
import { FontStyle } from "@/constants/Font";
import ModalHeader, { ModalHeaderProps } from "./ModalHeader";

export type SimpleModalProps = {
  visible: boolean;
  onRequestClose: () => void;
  children: React.ReactNode;
} & ModalHeaderProps;

export default function SimpleModalContainer({
  visible,
  onRequestClose,
  type,
  title,
  onPressBack,
  onPressExist,
  children,
}: SimpleModalProps) {
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
