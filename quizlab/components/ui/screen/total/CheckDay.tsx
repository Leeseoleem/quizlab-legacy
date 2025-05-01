import { View, Text, StyleSheet } from "react-native";
import { AttendanceStatus } from "@/utils/cloud/learning";

import FontAwesome6 from "@expo/vector-icons/FontAwesome6";

import { FontStyle } from "@/constants/Font";
import { MainColors, GrayColors } from "@/constants/Colors";

type CheckDAyProps = {
  day: string;
  status: AttendanceStatus;
};

export default function CheckDay({ day, status }: CheckDAyProps) {
  return (
    <View style={styles.container}>
      {status === "attended" && (
        <FontAwesome6
          name="circle-chevron-down"
          size={32}
          color={MainColors.safe}
        />
      )}
      {status === "absent" && (
        <FontAwesome6 name="circle-minus" size={32} color={MainColors.danger} />
      )}
      {status === "upcoming" && <View style={styles.upcomingIcon} />}
      <Text style={styles.day}>{day}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
    gap: 12,
  },
  upcomingIcon: {
    width: 32,
    height: 32,
    borderRadius: 64,
    backgroundColor: GrayColors.white,
  },
  day: {
    ...FontStyle.subTitle,
    color: GrayColors.grayHax,
  },
});
