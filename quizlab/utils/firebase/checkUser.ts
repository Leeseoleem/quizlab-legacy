import { auth } from "@/lib/firebaseConfig";
import { User } from "firebase/auth"; // 추가
import { router } from "expo-router";
import showToast from "../showToast";

export const checkAuthAndRedirect = (): User | null => {
  const user = auth.currentUser;

  if (!user) {
    showToast("로그인이 만료되었습니다");
    router.replace("/(auth)/login");
    return null;
  }

  return user;
};
