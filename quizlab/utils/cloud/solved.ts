import { db, auth } from "@/lib/firebaseConfig";
import {
  collection,
  query,
  addDoc,
  doc,
  setDoc,
  getDoc,
  getDocs,
  Timestamp,
  orderBy,
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
