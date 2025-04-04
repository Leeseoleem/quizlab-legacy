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
} from "firebase/firestore";

export async function createFolder(
  userId: string,
  title: string,
  description: string
): Promise<void> {
  try {
    const docRef = await addDoc(collection(db, "folders"), {
      title,
      description,
      createdBy: userId,
      createdAt: serverTimestamp(),
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

    await updateDoc(folderRef, {
      ...updatedData,
      updatedAt: serverTimestamp(), // 수정 시간 갱신
    });

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
  const q = query(collection(db, "folders"), where("createdBy", "==", userId));
  const snapshot = await getDocs(q);

  return snapshot.docs.map((doc) => ({
    id: doc.id, // 문서 id
    ...(doc.data() as Omit<Folder, "id">),
  }));
}

export type Folder = {
  id: string; // ← 문서 ID (doc.id)
  title: string;
  description: string;
  createdBy: string;
  createdAt: Timestamp;
  updatedAt?: Timestamp; // 수정 전에는 없을 수 있으니까 optional
};
