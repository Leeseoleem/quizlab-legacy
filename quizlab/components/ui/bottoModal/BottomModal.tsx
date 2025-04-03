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

// 1. props 타입 정의
type BottomModalProps = {
  title: string;
  onConfirm?: () => void;
};

// 2. ref 타입 정의
export type BottomModalRef = {
  open: () => void;
  close: () => void;
};

// 3. 컴포넌트 정의 (props/ref 둘 다 타입 명시 X)
const BottomModal = (
  props: BottomModalProps,
  ref: React.Ref<BottomModalRef>
) => {
  const { title, onConfirm } = props;
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
          <Text style={{ fontSize: 16 }}>{title}</Text>
          {onConfirm && (
            <TouchableOpacity onPress={onConfirm}>
              <Text style={{ color: "blue", marginTop: 16 }}>확인</Text>
            </TouchableOpacity>
          )}
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
    padding: 24,
    alignItems: "center",
    justifyContent: "center",
  },
});
