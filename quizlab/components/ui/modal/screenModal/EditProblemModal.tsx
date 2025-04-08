import { View, Text } from "react-native";

import ModalContainer from "../ModalContainer";

import { FirstRoute } from "./tabScreen/FirstRoute";
import React from "react";
import { SecondRoute, SecondRouteProps } from "./tabScreen/SecondRoute";

type EditDes = {
  visible: boolean;
  onRequestClose: () => void;
  onEditDes: () => void;

  editProblemText: string;
  setEditProblemText: React.Dispatch<React.SetStateAction<string>>;
  editAnswerText: string;
  setEditAnswerText: React.Dispatch<React.SetStateAction<string>>;
};

const EditDesProblemModal = ({
  visible,
  onRequestClose,
  onEditDes,
  editProblemText,
  setEditProblemText,
  editAnswerText,
  setEditAnswerText,
}: EditDes) => {
  return (
    <ModalContainer
      visible={visible}
      onRequestClose={onRequestClose}
      title="수정하기"
      type="back"
      onPressBack={onRequestClose}
      btnTitleLeft="취소"
      btnTitleRight="완료"
      onPressCancle={onRequestClose}
      onPressOk={onEditDes}
    >
      <View>
        <FirstRoute
          problemText={editProblemText}
          setProblemText={setEditProblemText}
          answerText={editAnswerText}
          setAnswerText={setEditAnswerText}
        />
      </View>
    </ModalContainer>
  );
};

type EditChoice = {
  visible: boolean;
  onRequestClose: () => void;
  onEditChoice: () => void;
} & SecondRouteProps;

const EditChoiceProblemModal = ({
  visible,
  onRequestClose,
  onEditChoice,
  // SecondRoute
  problemText,
  setProblemText,
  option,
  setOptions,
  scrollListRef,
}: EditChoice) => {
  return (
    <ModalContainer
      visible={visible}
      onRequestClose={onRequestClose}
      title="수정하기"
      type="back"
      onPressBack={onRequestClose}
      btnTitleLeft="취소"
      btnTitleRight="완료"
      onPressCancle={onRequestClose}
      onPressOk={onEditChoice}
    >
      <View>
        <SecondRoute
          problemText={problemText}
          setProblemText={setProblemText}
          option={option}
          setOptions={setOptions}
          scrollListRef={scrollListRef}
        />
      </View>
    </ModalContainer>
  );
};

export { EditDesProblemModal, EditChoiceProblemModal };
