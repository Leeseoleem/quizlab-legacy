import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebaseConfig";

import showToast from "./showToast";
import { router } from "expo-router";

const handleSignout = async () => {
  try {
    await signOut(auth);
    showToast("로그아웃 되었습니다");
    router.replace("/(auth)");
    console.log("✅ 로그아웃 성공");
    // 로그아웃 후 처리 (예: 로그인 페이지로 이동)
  } catch (error) {
    showToast("오류가 발생했습니다");
    console.error("❌ 로그아웃 실패:", error);
  }
};

export { handleSignout };
