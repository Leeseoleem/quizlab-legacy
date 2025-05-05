export const validateNickname = (nickname: string): string | null => {
  // 정규식: 한글, 영문 대소문자, 숫자만 허용 / 길이 2~20자
  const nicknameRegex = /^[가-힣ㄱ-ㅎㅏ-ㅣa-zA-Z0-9]{2,20}$/;

  if (!nickname) {
    return "닉네임을 입력해주세요.";
  }

  if (nickname.length < 2 || nickname.length > 20) {
    return "닉네임은 2자 이상 20자 이하로 입력해주세요.";
  }

  if (!nicknameRegex.test(nickname)) {
    return "닉네임은 한글, 영문, 숫자만 사용할 수 있어요.";
  }

  return null; // 통과
};
