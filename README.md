# quizlab
나만의 문제집, 함께 푸는 즐거움

## problems 컬렉션 구조 정리

### 🔸 공통 필드

| 필드명      | 타입                              | 설명                         |
|------------|----------------------------------|------------------------------|
| `type`     | `"descriptive"` \| `"choice"`    | 문제 유형                    |
| `question` | `string`                         | 문제 내용                    |
| `folderId` | `string`                         | 어떤 폴더에 속한 문제인지   |
| `imageUrl?`| `string`                         | 문제 이미지 (선택)          |
| `createdAt`| `Timestamp`                      | 생성일                       |
| `updatedAt?`| `Timestamp`                     | 수정일 (선택)               |

---

### 🔹 서술형 문제 (`type: "descriptive"`)

| 필드명  | 타입     | 설명         |
|--------|----------|--------------|
| `answer` | `string` | 정답 텍스트  |

---


### 🔹 선택형 문제 (`type: "choice"`)

| 필드명       | 타입                     | 설명                                             |
|--------------|--------------------------|--------------------------------------------------|
| `type`       | `"choice"`               | 문제 유형 (선택형 문제)                         |
| `folderId`   | `string`                 | 문제가 속한 폴더의 ID                            |
| `question`   | `string`                 | 문제 본문                                        |
| `options`    | `ChoiceOption[]`         | 보기 목록 (`text`, `isCorrect`, 선택적 해설 포함)|
| `imageUrl`   | `string \| undefined`    | 문제에 포함된 이미지 URL (선택)                 |


### 🔸 `ChoiceOption` 구조

| 필드명         | 타입         | 설명                                |
|----------------|--------------|-------------------------------------|
| `text`         | `string`     | 보기 내용                            |
| `isCorrect`    | `boolean`    | 이 보기가 정답인지 여부              |
| `explanation`  | `string?`    | (선택) 해당 보기에 대한 해설          |



