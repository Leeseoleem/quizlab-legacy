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
import { generateKeywords } from "@/utils/generateKeywords";

export async function createFolder(
  userId: string,
  title: string,
  description: string
): Promise<void> {
  const keywords = generateKeywords(title);

  try {
    const docRef = await addDoc(collection(db, "folders"), {
      title, // 폴더명
      description, // 폴더 설명
      createdBy: userId, // 폴더 제작 사용자 명
      updatedAt: serverTimestamp(), // 제작 시간
      keywords, // 검색용 키워드
    });

    console.log("폴더 생성 완료! ID:", docRef.id);
  } catch (error) {
    console.error("폴더 생성 중 오류 발생:", error);
    throw error;
  }
}

// 수정 함수
export async function updateFolder(
  folderId: string,
  updatedData: {
    title?: string;
    description?: string;
  }
): Promise<void> {
  try {
    const folderRef = doc(db, "folders", folderId);

    const updatedFields: any = {
      ...updatedData,
      updatedAt: serverTimestamp(),
    };

    if (updatedData.title) {
      updatedFields.keywords = generateKeywords(updatedData.title);
    }

    await updateDoc(folderRef, updatedFields);

    console.log("✏️ 폴더 수정 성공:", folderId);
  } catch (error) {
    console.error("❌ 폴더 수정 실패:", error);
    throw error;
  }
}

export async function deleteFolder(folderId: string): Promise<void> {
  try {
    const folderRef = doc(db, "folders", folderId);
    await deleteDoc(folderRef);
    console.log("🗑️ 폴더 삭제 완료:", folderId);
  } catch (error) {
    console.error("❌ 폴더 삭제 중 오류:", error);
    throw error;
  }
}

// 파일 가져오기
export async function getUserFolders(userId: string) {
  const q = query(
    collection(db, "folders"),
    where("createdBy", "==", userId),
    orderBy("updatedAt", "desc")
  );
  const snapshot = await getDocs(q);

  return snapshot.docs.map((doc) => ({
    id: doc.id, // 문서 id
    ...(doc.data() as Omit<Folder, "id">),
  }));
}

// 폴더 검색
export async function searchFolderByKeyword(keyword: string, userId: string) {
  const folderRef = collection(db, "folders");

  const q = query(
    folderRef,
    where("createdBy", "==", userId), // 현재 유저의 폴더만 검색
    where("keywords", "array-contains", keyword) // 키워드 포함 조건
  );

  const snapshot = await getDocs(q);

  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...(doc.data() as Omit<Folder, "id">),
  }));
}

export type Folder = {
  id: string; // ← 문서 ID (doc.id)
  title: string;
  description: string;
  createdBy: string;
  updatedAt: Timestamp;
  keywords: string[];
};
