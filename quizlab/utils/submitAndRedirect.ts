import { SolvedProblemDoc, SolvedMode } from "@/types/solved";
import { saveSolvedResult } from "@/utils/cloud/solved";
import showToast from "./showToast";
import { router } from "expo-router"; // 또는 Next.js라면 useRouter() 사용

type SubmitArgs = {
  folderId: string;
  mode: SolvedMode;
  solving: SolvedProblemDoc[];
  startedAt: Date;
  remainingSeconds?: number; // timed 모드에서만 필요
};

export async function submitAndRedirect({
  folderId,
  mode,
  solving,
  startedAt,
  remainingSeconds,
}: SubmitArgs) {
  try {
    const solvedId = await saveSolvedResult({
      folderId,
      mode,
      solving,
      startedAt,
      remainingSeconds,
    });

    router.replace(`/solved/${solvedId}`);
  } catch (err) {
    console.error("❌ 제출 실패:", err);
    showToast("오류가 발생했습니다");
  }
}
