import { updateProfile } from "firebase/auth";
import { auth } from "@/lib/firebaseConfig";
import { fetchCurrentUserInfo } from "./userInfoFetcher";

export const changeNickname = async (newNickname: string) => {
  const user = auth.currentUser;
  if (user) {
    try {
      await updateProfile(user, {
        displayName: newNickname,
      });
      console.log("✅ 닉네임 변경 성공");

      const updatedUser = await fetchCurrentUserInfo();
      return updatedUser;
    } catch (error) {
      console.error("❌ 닉네임 변경 실패:", error);
    }
  } else {
    console.log("❗ 로그인된 유저가 없습니다.");
  }
};
