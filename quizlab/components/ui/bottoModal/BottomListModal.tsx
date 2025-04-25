import React, {
  useImperativeHandle,
  useRef,
  forwardRef,
  useState,
  useMemo,
  useCallback,
} from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
} from "react-native";
import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";
import { GrayColors, MainColors } from "@/constants/Colors";
import Feather from "@expo/vector-icons/Feather";

type Folder = {
  id: string; // folderId
  title: string; // 화면에 표시될 제목
};

// props 타입 정의
type BottomModalProps = {
  folders: Folder[];
  selectedId: string; // 현재 선택된 folderId
  onSelect: (folderId: string) => void;
};

// ref 타입 정의
export type BottomModalRef = {
  open: () => void;
  close: () => void;
};

const BottomListModal = (
  props: BottomModalProps,
  ref: React.Ref<BottomModalRef>
) => {
  const { folders, selectedId, onSelect } = props;
  const bottomSheetRef = useRef<BottomSheet>(null);
  const snapPoints = useMemo(() => [], []);
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
      <View style={styles.overlay} onTouchEnd={() => setVisible(false)} />
      <BottomSheet
        ref={bottomSheetRef}
        index={0}
        snapPoints={snapPoints}
        onChange={handleSheetChange}
        enablePanDownToClose
        backgroundStyle={{ borderRadius: 16 }}
      >
        <BottomSheetView style={styles.contentContainer}>
          <FlatList
            data={folders}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => onSelect(item.id)}
                style={styles.optionRow}
              >
                <Text
                  style={[
                    styles.btnTitle,
                    selectedId === item.id && { color: MainColors.primary },
                  ]}
                >
                  {item.title}
                </Text>
                {selectedId === item.id && (
                  <Feather name="check" size={20} color={MainColors.primary} />
                )}
              </TouchableOpacity>
            )}
            ListHeaderComponent={
              <TouchableOpacity
                activeOpacity={0.8}
                style={styles.optionRow}
                onPress={() => onSelect("")}
              >
                <Text
                  style={[
                    styles.btnTitle,
                    selectedId === "" && { color: MainColors.primary },
                  ]}
                  numberOfLines={1}
                >
                  전체
                </Text>
                {selectedId === "" && (
                  <Feather name="check" size={20} color={MainColors.primary} />
                )}
              </TouchableOpacity>
            }
          />
          <TouchableOpacity
            activeOpacity={0.8}
            style={styles.modalBtn}
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
export default forwardRef(BottomListModal);

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  contentContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  modalList: {
    width: "100%",
    padding: 20,
  },
  modalBtn: {
    width: "100%",
    padding: 16,
    alignItems: "center",
    borderTopWidth: 1,
    borderColor: GrayColors.gray10,
  },
  btnTitle: {
    fontFamily: "Pretendard-Medium",
    fontSize: 14,
    color: GrayColors.black,
  },
  optionRow: {
    width: "100%",
    padding: 20,
    flexDirection: "row",
    justifyContent: "space-between",
  },
});
