import { SolvedFolder } from "@/app/(tabs)/record";
import { Folder } from "../cloud/folders";

export const handleSolvedTitle = (folders: Folder[], item: SolvedFolder) => {
  return folders.find((f) => f.id === item.folderId)?.title ?? "제목 없음";
};
