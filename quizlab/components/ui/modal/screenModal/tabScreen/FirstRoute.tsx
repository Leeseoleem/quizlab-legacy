import { StyleSheet } from "react-native";
import { View } from "react-native";
import ModalLargeTextbox from "../../ModalLargeTextBox";
import { GrayColors } from "@/constants/Colors";

type FirstRouteProps = {
  problemText: string;
  setProblemText: React.Dispatch<React.SetStateAction<string>>;
  answerText: string;
  setAnswerText: React.Dispatch<React.SetStateAction<string>>;
};

const FirstRoute = ({
  problemText,
  setProblemText,
  answerText,
  setAnswerText,
}: FirstRouteProps) => (
  <View style={tabStyles.contanier}>
    <ModalLargeTextbox
      label="문제"
      placeholder="문제를 입력하세요"
      text={problemText}
      onChangetText={setProblemText}
    />
    <View
      style={{
        height: 16,
      }}
    />
    <ModalLargeTextbox
      label="정답"
      placeholder="정답을 입력하세요"
      text={answerText}
      onChangetText={setAnswerText}
    />
  </View>
);

const tabStyles = StyleSheet.create({
  contanier: {},
  addBtn: {
    height: 46,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: GrayColors.gray20,
  },
  btnTitle: {
    marginLeft: 4,
    fontFamily: "Pretendard-Medium",
    fontSize: 12,
    color: GrayColors.black,
  },
});

export { FirstRouteProps, FirstRoute };
