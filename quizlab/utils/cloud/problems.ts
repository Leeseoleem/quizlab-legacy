import { db } from "@/lib/firebaseConfig";
import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  serverTimestamp,
  doc,
  updateDoc,
  query,
  where,
  Timestamp,
  orderBy,
} from "firebase/firestore";

// 타입 변수- 서술형
type DescriptiveInput = {
  type: "descriptive";
  folderId: string;
  question: string;
  answer: string;
  imageUrl?: string;
};

// 타입 변수- 선택형
type ChoiceInput = {
  type: "choice";
  folderId: string;
  question: string;
  options: ChoiceOption[];
  imageUrl?: string;
};

// 선택형 문제
type ChoiceOption = {
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
