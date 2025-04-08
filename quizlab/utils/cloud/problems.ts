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
  Timestamp,
  orderBy,
} from "firebase/firestore";

// 타입 변수- 서술형
export type DescriptiveInput = {
  type: "descriptive";
  folderId: string;
  question: string;
  answer: string;
  imageUrl?: string;
};

// 타입 변수- 선택형
export type ChoiceInput = {
  type: "choice";
  folderId: string;
  question: string;
  options: ChoiceOption[];
  imageUrl?: string;
};

// 선택형 문제
export type ChoiceOption = {
  text: string;
  isCorrect: boolean;
};

// 타입 변수- 유형 선택
export type ProblemInput = DescriptiveInput | ChoiceInput;

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
export async function getUserProblems(folderId: string) {
  const q = query(
    collection(db, "problems"),
    where("folderId", "==", folderId),
    orderBy("createdAt", "desc")
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
