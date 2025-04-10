import { Animated, Text, StyleSheet } from "react-native";
import { useEffect, useRef } from "react";
import { GrayColors } from "@/constants/Colors";

type AnimatedAlertProps = {
  visible: boolean;
  onFinish: () => void;
  message: string;
  top?: number;
  bottom?: number;
  left?: number;
  right?: number;
};

export default function AnimatedAlert({
  visible,
  onFinish,
  message,
  top,
  bottom,
  left,
  right,
}: AnimatedAlertProps) {
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      // Fade-in
      Animated.timing(fadeAnim, {
        toValue: 0.8,
        duration: 300,
        useNativeDriver: true,
      }).start();

      // Fade-out after 5s
      const timeout = setTimeout(() => {
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }).start(() => {
          onFinish(); // 외부에서 visible 상태 초기화
        });
      }, 5000);

      return () => clearTimeout(timeout);
    }
  }, [visible]);

  if (!visible) return null;

  return (
    <Animated.View
      style={[styles.alertBox, { opacity: fadeAnim, top, bottom, left, right }]}
    >
      <Text style={styles.text}>{message}</Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  alertBox: {
    position: "absolute",
    padding: 12,
    backgroundColor: GrayColors.gray20,
    borderWidth: 1,
    borderColor: GrayColors.grayHax,
    borderRadius: 8,
    zIndex: 50,
  },
  text: {
    fontFamily: "Pretendard-Regular",
    fontSize: 10,
  },
});
