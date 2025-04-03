import { auth } from "@/lib/firebaseConfig";

export const fetchCurrentUserInfo = async () => {
  const user = auth.currentUser;

  if (user) {
    return {
      uid: user.uid,
      email: user.email,
      nickname: user.displayName,
      photoURL: user.photoURL,
    };
  } else {
    // 아직 로그인 정보가 준비 안 된 상태일 수도 있음
    return null;
  }
};
