export const validateEmail = (email: string): string | boolean => {
  // 일반적인 이메일 정규식
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!email) {
    return "";
  }

  if (!emailRegex.test(email)) {
    return "올바른 이메일 형식을 입력해주세요.";
  }

  return true; // 유효
};
