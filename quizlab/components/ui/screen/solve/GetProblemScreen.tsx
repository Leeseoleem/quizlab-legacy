import { SafeAreaView } from "react-native-safe-area-context";
import { View, Text, Image } from "react-native";

import { GrayColors } from "@/constants/Colors";
import { FontStyle } from "@/constants/Font";

import runCat from "@/assets/images/runCat.png";

export default function GetProblemScreen() {
  return (
    <SafeAreaView
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Image
        source={runCat}
        style={{
          width: 250,
          height: 250,
        }}
      />
      <Text
        style={{
          ...FontStyle.subText,
          color: GrayColors.black,
        }}
      >
        문제를 가져오고 있어요!
      </Text>
    </SafeAreaView>
  );
}
