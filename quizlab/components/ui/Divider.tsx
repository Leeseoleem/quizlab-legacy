import { View, StyleSheet } from "react-native";
import { GrayColors } from "@/constants/Colors";

export default function Divider() {
  return <View style={styles.divider} />;
}

const styles = StyleSheet.create({
  divider: {
    height: 20,
    backgroundColor: GrayColors.gray10,
    borderTopWidth: 1,
    borderColor: GrayColors.gray20,
  },
});
