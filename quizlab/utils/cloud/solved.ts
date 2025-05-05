import { db, auth } from "@/lib/firebaseConfig";
import {
  collection,
  query,
  addDoc,
  doc,
  setDoc,
  getDoc,
  getDocs,
  deleteDoc,
  Timestamp,
  orderBy,
  writeBatch,
  where,
  limit,
} from "firebase/firestore";
import { SolvedMode, SolvedFolderDoc, SolvedProblemDoc } from "@/types/solved";

type SubmitSolvedArgs = {
  folderId: string;
  mode: SolvedMode;
  solving: SolvedProblemDoc[];
  startedAt: Date;
  remainingSeconds?: number;
};

export async function saveSolvedResult({
  folderId,
  mode,
  solving,
  startedAt,
  remainingSeconds,
}: SubmitSolvedArgs): Promise<string | null> {
  const user = auth.currentUser;
  if (!user) return null;
  const userId = user.uid;

  // ✅ 정답 여부 판단 (choice vs descriptive 분기)
  const withCorrectness = solving.map((p) => {
    let isCorrect = false;

    if (p.type === "choice" && p.options) {
      const selected = p.options.find((opt) => opt.userCheck);
      const correct = p.options.find((opt) => opt.isCorrect);
      isCorrect = selected?.id === correct?.id;
    } else {
      isCorrect = p.correctAnswer === p.userAnswer;
    }

    return {
      ...p,
      isCorrect,
    };
  });

  // ✅ 풀이 통계 계산
  const today = new Date();
  const dateString = today.toISOString().split("T")[0]; // "2025-04-16" 형태
  const submittedAt = Timestamp.now();
  const totalCount = withCorrectness.length;
  const correctCount = withCorrectness.filter((p) => p.isCorrect).length;
  const accuracy = Math.round((correctCount / totalCount) * 100);
  const duration = Math.floor(
    (submittedAt.toDate().getTime() - startedAt.getTime()) / 1000
  );

  const solvedFoldersRef = collection(
    db,
    "user_info",
    userId,
    "solved_folders"
  );

  const solvedFolderDoc: SolvedFolderDoc = {
    folderId,
    mode,
    totalCount,
    correctCount,
    accuracy,
    duration,
    date: dateString,
    startedAt: Timestamp.fromDate(startedAt),
    submittedAt,
    ...(mode === "timed" && { timeLimit: remainingSeconds }),
  };

  const folderRef = await addDoc(solvedFoldersRef, solvedFolderDoc);
  const solvedId = folderRef.id;

  const problemsRef = collection(folderRef, "problems");

  const saveProblemPromises = withCorrectness.map((p) => {
    const problemDoc: SolvedProblemDoc = {
      problemId: p.problemId,
      index: p.index,
      question: p.question,
      type: p.type,
      correctAnswer: p.correctAnswer,
      userAnswer: p.userAnswer,
      isCorrect: p.isCorrect ?? false,
      memoText: p.memoText ?? "",
      hasMemo: p.hasMemo ?? false,
      ...(p.type === "choice" && { options: p.options }), // ✅ 선택형은 options 포함
    };

    return setDoc(doc(problemsRef, p.problemId), problemDoc);
  });

  await Promise.all(saveProblemPromises);

  return solvedId;
}

// 최종 합계 폴더 불러오기 함수
export async function getSolvedFolder(
  userId: string,
  solvedId: string
): Promise<SolvedFolderDoc | null> {
  try {
    const docRef = doc(db, "user_info", userId, "solved_folders", solvedId);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) return null;

    return docSnap.data() as SolvedFolderDoc;
  } catch (error) {
    console.error("❌ 풀이 기록 가져오기 실패:", error);
    return null;
  }
}

// 최신 폴더 가져오기 함수
export async function getRecentSolvedFolders() {
  const user = auth.currentUser;
  if (!user) return [];

  const userId = user.uid;
  const solvedRef = collection(db, `user_info/${userId}/solved_folders`);

  const q = query(solvedRef, orderBy("submittedAt", "desc"), limit(10));

  const snapshot = await getDocs(q);

  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...(doc.data() as SolvedFolderDoc),
  }));
}

// 특정 문제 폴더 가져오기 함수
export async function getSolvedFoldersByFolderId(folderId?: string) {
  const user = auth.currentUser;
  if (!user) {
    console.log("❌ 유저 없음, 중단됨");
    return [];
  }

  const userId = user.uid;
  const baseRef = collection(db, `user_info/${userId}/solved_folders`);

  try {
    const q = folderId
      ? query(
          baseRef,
          where("folderId", "==", folderId),
          orderBy("submittedAt", "desc")
        )
      : query(baseRef, orderBy("submittedAt", "desc")); // ✅ 정렬 필드를 통일

    const snapshot = await getDocs(q);
    console.log("📦 쿼리된 문서 수:", snapshot.size);

    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...(doc.data() as SolvedFolderDoc),
    }));
  } catch (error) {
    console.error("❌ Firestore 쿼리 에러:", error);
    return [];
  }
}

// 폴더 삭제하기
export async function deleteSolvedFolder(solvedId: string) {
  const user = auth.currentUser;
  if (!user) {
    console.log("❌ 유저 없음, 중단됨");
    return [];
  }

  const userId = user.uid;
  try {
    const solvedFolderRef = doc(
      db,
      "user_info",
      userId,
      "solved_folders",
      solvedId
    );
    await deleteDoc(solvedFolderRef);
    console.log("🗑️ 문제 삭제 완료:", solvedId);
  } catch (error) {
    console.error("❌ 문제 삭제 중 오류:", error);
    throw error;
  }
}

// 문제 내역 불러오기 함수
export async function getSolvedProblems(
  userId: string,
  solvedId: string
): Promise<SolvedProblemDoc[]> {
  try {
    const problemsRef = query(
      collection(
        db,
        "user_info",
        userId,
        "solved_folders",
        solvedId,
        "problems"
      ),
      orderBy("index", "asc")
    );
    const snap = await getDocs(problemsRef);
    return snap.docs.map((doc) => doc.data() as SolvedProblemDoc);
  } catch (error) {
    console.error("❌ 문제 기록 가져오기 실패:", error);
    return [];
  }
}

/**
 * solved_folders/{solvedId}/problems/{problemId}의 memoText를 일괄 저장합니다
 */
export const updateSolvedProblemMemos = async (
  userId: string,
  solvedId: string,
  memoMap: Record<string, string>
) => {
  const batch = writeBatch(db);

  const updates = Object.entries(memoMap);
  if (updates.length === 0) {
    console.log("⚠️ 저장할 메모가 없습니다");
    return;
  }

  updates.forEach(([problemId, text]) => {
    const trimmed = text.trim();
    if (trimmed.length === 0) return; // ✨ 빈 값은 제외 (원한다면 삭제 처리도 가능)

    const ref = doc(
      db,
      "user_info",
      userId,
      "solved_folders",
      solvedId,
      "problems",
      problemId
    );

    console.log("📝 저장 대상:", problemId, "내용:", trimmed);

    batch.update(ref, {
      memoText: trimmed,
      hasMemo: true,
    });
  });

  try {
    await batch.commit();
    console.log("✅ 오답 노트 자동 저장 완료");
  } catch (e) {
    console.error("❌ Firestore 저장 실패:", e);
  }
};

// 자주 틀린 문제 Top 5 가져오기
export type WrongProblemSummary = {
  problemId: string;
  question: string;
  correctAnswer: string;
  totalCount: number;
  wrongCount: number;
  wrongRate: number; // 정답률 (0~100)
};

export const getWrongTop5ByFolder = async (
  folderId: string
): Promise<WrongProblemSummary[]> => {
  const user = auth.currentUser;
  if (!user) {
    console.log("❌ 유저 없음");
    return [];
  }

  const userId = user.uid;
  const problemStats: Record<
    string,
    Omit<WrongProblemSummary, "problemId" | "wrongRate">
  > = {};

  const solvedFoldersSnap = await getDocs(
    collection(db, "user_info", userId, "solved_folders")
  );

  for (const folderDoc of solvedFoldersSnap.docs) {
    const folderData = folderDoc.data();
    if (folderData.folderId !== folderId) continue;

    const problemsSnap = await getDocs(collection(folderDoc.ref, "problems"));

    problemsSnap.docs.forEach((doc) => {
      const data = doc.data();
      const { problemId, question, correctAnswer, isCorrect } = data;

      if (!problemId || !question || !correctAnswer) return;

      if (!problemStats[problemId]) {
        problemStats[problemId] = {
          question,
          correctAnswer,
          totalCount: 0,
          wrongCount: 0,
        };
      }

      problemStats[problemId].totalCount++;
      if (isCorrect === false) {
        problemStats[problemId].wrongCount++;
      }
    });
  }

  const sorted = Object.entries(problemStats)
    .map(([problemId, data]) => {
      const wrongRate =
        data.totalCount > 0 ? data.wrongCount / data.totalCount : 0;

      return {
        problemId,
        question: data.question,
        correctAnswer: data.correctAnswer,
        totalCount: data.totalCount,
        wrongCount: data.wrongCount,
        wrongRate,
      };
    })
    .filter((item) => item.wrongCount > 0) // ✅ 오답이 한 번도 없으면 제외
    .sort((a, b) => b.wrongRate - a.wrongRate)
    .slice(0, 5);

  return sorted;
};

export type AccuracyPoint = {
  date: string; // 날짜 (예: "2025-04-21")
  accuracy: number; // 해당 날짜의 평균 정답률 (0~100)
};

// 평균 정답률 출력
export const getFolderAccuracyByDate = async (
  folderId: string
): Promise<AccuracyPoint[]> => {
  const user = auth.currentUser;
  if (!user) {
    console.log("❌ 유저 없음");
    return [];
  }

  const userId = user.uid;
  const snap = await getDocs(
    collection(db, "user_info", userId, "solved_folders")
  );

  const accuracyByDate: Record<string, number[]> = {};

  snap.docs.forEach((doc) => {
    const data = doc.data();

    // ✅ 해당 폴더만 필터
    if (data.folderId !== folderId) return;

    // ✅ 날짜와 정답률 유효한 경우만 처리
    if (data.date && typeof data.accuracy === "number") {
      const date = data.date;
      if (!accuracyByDate[date]) accuracyByDate[date] = [];
      accuracyByDate[date].push(data.accuracy);
    }
  });

  // ✅ 날짜별 평균 계산
  const aggregated: AccuracyPoint[] = Object.entries(accuracyByDate).map(
    ([date, values]) => ({
      date,
      accuracy: values.reduce((sum, cur) => sum + cur, 0) / values.length,
    })
  );

  // ✅ 날짜 내림차순 → 최근 날짜 기준 정렬
  const sortedDesc = aggregated.sort((a, b) => b.date.localeCompare(a.date));

  // ✅ 최근 10개만 추출하고 다시 오름차순 정렬
  const latest10 = sortedDesc
    .slice(0, 10)
    .sort((a, b) => a.date.localeCompare(b.date));

  return latest10;
};
