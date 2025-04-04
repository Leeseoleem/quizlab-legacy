import React, {
  useImperativeHandle,
  useRef,
  forwardRef,
  useState,
  useMemo,
  useCallback,
} from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";
import { GrayColors, MainColors } from "@/constants/Colors";

// props 타입 정의
type BottomModalProps = {
  title: string;
  onEdit?: () => void;
  onDelete?: () => void;
};

// ref 타입 정의
export type BottomModalRef = {
  open: () => void;
  close: () => void;
};

const BottomModal = (
  props: BottomModalProps,
  ref: React.Ref<BottomModalRef>
) => {
  const { title, onEdit, onDelete } = props;
  const bottomSheetRef = useRef<BottomSheet>(null);
  const snapPoints = useMemo(() => ["40%"], []);
  const [visible, setVisible] = useState(false);

  useImperativeHandle(ref, () => ({
    open: () => setVisible(true),
    close: () => bottomSheetRef.current?.close(),
  }));

  const handleSheetChange = useCallback((index: number) => {
    if (index === -1) setVisible(false);
  }, []);

  if (!visible) return null;

  return (
    <View style={StyleSheet.absoluteFill}>
      <View style={styles.overlay} />
      <BottomSheet
        ref={bottomSheetRef}
        index={0}
        snapPoints={snapPoints}
        onChange={handleSheetChange}
        enablePanDownToClose
        backgroundStyle={{ borderRadius: 16 }}
      >
        <BottomSheetView style={styles.contentContainer}>
          <View style={styles.headerTitle}>
            <Text style={styles.title}>{title}</Text>
          </View>
          <TouchableOpacity
            activeOpacity={0.8}
            style={styles.modalBtn}
            onPress={onEdit}
          >
            <Text style={styles.btnTitle} numberOfLines={1}>
              수정하기
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={0.8}
            style={styles.modalBtn}
            onPress={onDelete}
          >
            <Text style={{ ...styles.btnTitle, color: MainColors.danger }}>
              삭제하기
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={0.8}
            style={{
              ...styles.modalBtn,
              alignItems: "center",
              borderTopWidth: 1,
              borderColor: GrayColors.gray20,
            }}
            onPress={() => setVisible(false)}
          >
            <Text style={styles.btnTitle}>닫기</Text>
          </TouchableOpacity>
        </BottomSheetView>
      </BottomSheet>
    </View>
  );
};

// 4. forwardRef로 감싸면서 타입 적용
export default forwardRef(BottomModal);

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  contentContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    width: "100%",
    paddingVertical: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontFamily: "Pretendard-Regular",
    fontSize: 12,
    color: GrayColors.gray30,
  },
  modalBtn: {
    width: "100%",
    padding: 16,
  },
  btnTitle: {
    fontFamily: "Pretendard-Medium",
    fontSize: 14,
    color: GrayColors.black,
  },
});
