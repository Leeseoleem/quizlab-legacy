import ModalLargeTextbox from "../modal/ModalLargeTextBox";

export type DescriptiveProps = {
  answerText: string;
  onChangeText: (text: string) => void;
};

export default function DescriptiveSection({
  answerText,
  onChangeText,
}: DescriptiveProps) {
  return (
    <ModalLargeTextbox
      label="정답"
      placeholder="정답을 입력해주세요."
      text={answerText}
      onChangetText={onChangeText}
    />
  );
}
