import { db } from "@/lib/firebaseConfig";
import {
  collection,
  addDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  serverTimestamp,
  doc,
  query,
  where,
  orderBy,
} from "firebase/firestore";

import { DescriptiveInput, ChoiceInput, ProblemInput } from "@/types/problems";

// 문제 생성 함수
export async function createProblem(problem: ProblemInput): Promise<string> {
  try {
    const docRef = await addDoc(collection(db, "problems"), {
      ...problem,
      createdAt: serverTimestamp(),
    });

    console.log("✅ 문제 추가 완료:", docRef.id);
    return docRef.id;
  } catch (error) {
    console.error("❌ 문제 추가 실패:", error);
    throw error;
  }
}

// 문제 수정하기
export async function updateProblem(
  problemId: string,
  updatedData: Partial<DescriptiveInput> | Partial<ChoiceInput>
): Promise<void> {
  try {
    const problemRef = doc(db, "problems", problemId);

    const updatedFields = {
      ...updatedData,
      createdAt: serverTimestamp(), // 최신화된 시간으로 갱신
    };

    await updateDoc(problemRef, updatedFields);

    console.log("✅ 문제 수정 성공:", problemId);
  } catch (error) {
    console.error("❌ 문제 수정 중 오류 발생:", error);
    throw error;
  }
}

// 문제 삭제하기
export async function deleteProblem(problemId: string) {
  try {
    const problemRef = doc(db, "problems", problemId);
    await deleteDoc(problemRef);
    console.log("🗑️ 문제 삭제 완료:", problemId);
  } catch (error) {
    console.error("❌ 문제 삭제 중 오류:", error);
    throw error;
  }
}

// 파일 가져오기
export async function getUserProblems(
  folderId: string,
  orderDirection: "asc" | "desc" = "desc"
) {
  const q = query(
    collection(db, "problems"),
    where("folderId", "==", folderId),
    orderBy("createdAt", orderDirection)
  );
  const snapshot = await getDocs(q);

  return snapshot.docs.map((doc) => {
    const data = doc.data() as ProblemInput;

    return {
      id: doc.id,
      ...data,
    };
  });
}

// 폴더 여부 확인하기
export async function checkFolderHasProblems(
  folderId: string
): Promise<boolean> {
  const q = query(
    collection(db, "problems"),
    where("folderId", "==", folderId)
  );
  const snapshot = await getDocs(q);
  return !snapshot.empty;
}
