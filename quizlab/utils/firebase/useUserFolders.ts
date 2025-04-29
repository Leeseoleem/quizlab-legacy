import { useState, useEffect } from "react";
import { checkAuthAndRedirect } from "./checkUser";
import { getUserFolders } from "@/utils/cloud/folders";
import { Folder } from "@/utils/cloud/folders";

export function useUserFolders() {
  const [folders, setFolders] = useState<Folder[]>([]);

  useEffect(() => {
    const fetchFolders = async () => {
      const user = checkAuthAndRedirect(); // 로그인 체크
      if (!user) return;

      try {
        const data = await getUserFolders(user.uid);
        setFolders(data ?? []);
      } catch (error) {
        console.error("❌ 폴더 불러오기 실패:", error);
        setFolders([]); // 안전하게 빈 배열
      }
    };

    fetchFolders();
  }, []);

  return folders;
}
