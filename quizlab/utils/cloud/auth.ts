import {
  fetchSignInMethodsForEmail,
  createUserWithEmailAndPassword,
  updateProfile,
  deleteUser,
} from "firebase/auth";
import { auth } from "@/lib/firebaseConfig";
import { createInitialUserInfo } from "./learning";
import showToast from "../showToast";

type SignUpInput = {
  email: string;
  password: string;
  nickname: string;
};

export const signUpWithEmail = async ({
  email,
  password,
  nickname,
}: SignUpInput) => {
  try {
    const signInMethods = await fetchSignInMethodsForEmail(auth, email);
    if (signInMethods.length > 0) {
      // 이메일이 이미 등록된 경우
      showToast("이미 가입된 이메일입니다");
      return; // 더 이상 진행하지 않음
    }
    // 1. Firebase Auth 계정 생성
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    const user = userCredential.user;

    // 2. displayName 업데이트
    await updateProfile(user, {
      displayName: nickname,
    });

    console.log("닉네임 설정 완료");

    await createInitialUserInfo(); // 학습 기록 초기화 실행
    return true;
  } catch (error) {
    console.error("회원가입 실패:", error);
    return false;
  }
};

export const deleteCurrentUser = async (): Promise<boolean> => {
  const user = auth.currentUser;

  if (!user) {
    showToast("로그인이 필요합니다.");
    return false;
  }

  try {
    await deleteUser(user);
    showToast("회원 탈퇴가 완료되었습니다.");
    return true;
  } catch (error: any) {
    console.error("❌ 회원 탈퇴 실패:", error);

    if (error.code === "auth/requires-recent-login") {
      showToast("보안을 위해 다시 로그인 후 탈퇴해주세요.");
    } else {
      showToast("회원 탈퇴 중 오류가 발생했습니다.");
    }

    return false;
  }
};
