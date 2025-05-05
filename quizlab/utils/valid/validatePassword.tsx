export const validatePassword = (password: string): string | boolean => {
  if (!password) {
    return "";
  }

  if (password.length < 6) {
    return "비밀번호는 6자 이상이어야 해요.";
  }

  if (password.length > 64) {
    return "비밀번호는 64자 이하로 입력해주세요.";
  }

  // 선택 조건: 영문 + 숫자 조합 권장 (강력한 비밀번호)
  const strongRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d!@#$%^&*()_+]{6,}$/;
  if (!strongRegex.test(password)) {
    return "영문과 숫자를 포함하면 더 안전해요.";
  }

  return true; // 유효
};
