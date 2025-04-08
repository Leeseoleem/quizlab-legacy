# quizlab: 나만의 문제집, 함께 푸는 즐거움
직접 만든 문제를 폴더로 정리하고, 타이머 모드부터 오답 노트까지 다양한 방식으로 풀어보세요.

**QuizLab**은 사용자가 직접 문제를 만들고 폴더별로 정리하여,  
다양한 모드(타이머 모드, 자유 모드, 오답 노트)로 문제를 풀 수 있는 웹/앱 통합 퀴즈 플랫폼입니다.

---

## 🔧 기술 스택

| 영역         | 기술                          |
|--------------|-------------------------------|
| Frontend     | Expo (React Native), TypeScript |
| Backend      | Firebase (Auth, Firestore)    |
| Design       | Figma             |

---

## 🧩 주요 기능

- ✅ 사용자 맞춤 문제 생성 및 폴더 관리
- ⏱ 타이머 모드 / 자유 모드 / 해설 모드 기능
- 📌 오답 기록 저장 

## 추후 지원 예정
- 📂 문제 공유 및 다운로드 시스템
- 정확도 기반 개인 학습 리포트 제공

---

```md
# 📘 QuizLab - 문제 풀이 기능 데이터 구조

문제 풀이 기능은 Firebase Firestore를 기반으로 구성되며, 다음과 같은 구조와 기능을 중심으로 설계되어 있습니다.

---

## 📦 Firestore 데이터 구조

### 🔹 `folders` 컬렉션
문제 폴더 정보를 저장합니다.

```ts
folders/{folderId} {
  title: string;          // 폴더 제목
  description: string;    // 폴더 설명
  updatedAt: Timestamp;   // 생성 시간(혹은 수정 시간)
  createdBy: string;      // 생성자(유저) ID
  keywords: string[];     // 검색용 키워드
}
```

---

### 🔹 `problems` 컬렉션
문제 데이터를 저장하는 전역 문제 은행입니다. 각 문제는 특정 폴더에 속합니다.

```ts
// 공통 부분
problems/{problemId} {
  folderId: string;                 // 소속된 폴더 ID
  type: "descriptive" | "choice";   // 문제 유형
  question: string;                 // 문제 본문
  imageUrl?: string;                // 이미지
  createdAt: Timestamp;             // 생성 시간(혹은 수정 시간)
}

// 타입 유형- 서술형
type DescriptiveInput = {
  answer: string;     // 서술형 정답
}

// 타입 유형- 선택형
export type ChoiceInput = {
  options: ChoiceOption[]; // 선택형 항목
};

// 선택형 항목 세부 요소
export type ChoiceOption = {
  text: string;        // 항목 내용
  isCorrect: boolean;  // 정답 여부(항목 중 한 개만 선택 가능)
};

```

---

### 🔹 `user_info` 컬렉션
유저별 정보를 저장합니다.

```ts
user_info/{userId}
```

#### └─ `solved_folders` 서브컬렉션
각 폴더 풀이 세션의 요약 정보를 저장합니다.

```ts
user_info/{userId}/solved_folders/{sessionId} {
  folderId: string;              // 풀었던 폴더 ID
  mode: "timed" | "free" | "review"; // 풀이 모드
  startedAt: Timestamp;          // 시작 시각
  endedAt: Timestamp;            // 종료 시각
  totalCount: number;            // 전체 문제 수
  correctCount: number;          // 맞힌 문제 수
  accuracy: number;              // 정답률 (%)
}
```

#### └─ `solved_problems` 서브컬렉션
세션 동안 풀었던 각 문제의 풀이 결과를 저장합니다.

```ts
user_info/{userId}/solved_folders/{sessionId}/solved_problems/{problemId} {
  userAnswer: string;       // 사용자의 응답
  correctAnswer: string;    // 정답
  isCorrect: boolean;       // 정답 여부
  solvedAt: Timestamp;      // 제출 시각
}
```

---

## 📎 구조 설계 철학

- 전역 `problems` 컬렉션: 문제 은행으로 공유 가능
- 유저별 `solved_folders`: 세션 단위 저장으로 기록 분석 용이
- 문제 풀이 결과는 서브컬렉션 `solved_problems`에 분리 저장
- 모드별 기능 확장을 고려한 구조 (시간 제한 / 자유 / 해설 모드)

---

## ✨ 확장 가능 기능

- 오답노트 저장 기능
- 문제 다시 풀기 (세션 재생성)
- 정답률 그래프 시각화
- 공유된 폴더 다운로드 시 풀이 기록 연결




