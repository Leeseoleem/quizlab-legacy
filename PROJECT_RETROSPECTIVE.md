## 1. 프로젝트 개요

### 프로젝트명: QuizLab

---

## 2. 프로젝트 개요

> 자격증 시험을 준비하면서, 반복적으로 헷갈리는 문제들을 따로 모아 다시 풀 수 있는 기능이 필요하다고 느꼈다.
> 
> 
> 플레이 스토어를 비롯한 여러 앱을 찾아봤지만, 원하는 기능을 온전히 갖춘 앱은 찾지 못했고,
> 
> 결국 스스로 내가 원하는 기능을 담은 문제 은행 앱을 만들기로 결심하게 되었다.
> 

이 앱은 단순한 문제 풀이 기능을 넘어서,

- 사용자가 직접 문제를 만들고
- 원하는 모드로 반복 학습하며
- 오답을 정리하고 통계를 확인할 수 있는 자기 주도형 학습 앱

이라는 점에 중점을 둔다.,

---

## 3. 일정

- 프로젝트 시작일: 2025.04.01
- 프로젝트 종료일: 2025.04.30 (1차 완성)
- 리팩토링 시작일: 미정

### 주요 마일스톤

- 2025.03 ~ 프로젝트 기획
- 2025.04 초: 화면 구성 및 UI 설계 (Figma)
- 2025.04 중~후반: 개발 시작 및 주요 기능 구현
- 2025.04 말: 기능 마무리 및 1차 회고 준비, 리팩토링 기획

---

## 4. 팀 구성

### **1) 팀 형태**

- 개인 프로젝트

### **2) 역할 및 책임**

- **UI/UX 디자인**:
    
    Figma를 활용해 전체 앱 흐름 및 화면 구조 설계
    
- **프론트엔드 개발:**
    
    React Native 기반의 Expo를 활용해 앱 전체 기능 구현
    
- **백엔드 구성:**
    
    Firebase를 통해 인증, 데이터베이스, 사용자 정보 관리 구현
    

### 3) 강점 및 특징

- 개인 프로젝트로서 자유로운 의사 결정 및 빠른 구조 수정 가능
- 기획부터 디자인, 개발까지 전 과정을 직접 수행하며 전반적인 앱 개발 역량 향상
- 프로젝트를 통해 자신의 강점과 한계, 개발 속도 및 집중 방식에 대해 명확히 파악할 수 있었음

### 4) 협업 및 관리 도구

- 디자인: Figma
- 문서 정리 및 기획 노트: Notion
- 버전 관리 및 코드 공유: GitHub

---

## 5. 기술 스택

### 사용한 주요 기술

| 항목 | 내용 |
| --- | --- |
| **프레임워크** | Expo **SDK 52** – 개발 당시 기준 버전 → 리팩토링은 SDK 53 기준으로 진행 예정 |
| **언어** | TypeScript – 정적 타입 기반 안정성 확보 |
| **스타일링** | `StyleSheet.create()` 기반 인라인 스타일 사용 →  React Native 공식 스타일 방식 채택 |
| **라우팅** | `expo-router` – 파일 기반 라우팅, 깔끔한 페이지 구조화 |
| **상태 관리** | useState 기반 로컬 상태 관리 |
| **데이터베이스 & 인증** | Firebase Authentication + Cloud Firestore |
| **차트 라이브러리** | `react-native-chart-kit` – 사용자 통계 시각화용 |
| **디자인 툴** | Figma – 전체 UI 흐름 기획 |
| **문서/정리 도구** | Notion – 기능 정리 및 일정/아이디어 관리 |

---

## 6. 아키텍처 (Architecture)

### 1) 전체 앱 플로우

1. **로그인 / 회원가입**
    - Firebase Authentication을 이용 이메일 기반 로그인 처리
2. **문제 폴더 확인 및 생성**
    - 문제 탭에서 기존 폴더를 확인하거나 새 폴더를 생성
3. **문제 풀기**
    - 폴더를 선택 후 문제 리스트 진입
    - 자유 모드 / 타이머 모드 / 오답 복습 모드 중 선택
4. **결과 저장**
    - 풀이 완료 후 결과를 Firestore에 자동 저장
5. **기록 확인**
    - 기록 탭에서 풀이 결과, 정확도, 오답 등을 확인
6. **통계 확인**
    - 사용자 학습 통계 (정답률, 총 풀이 시간, 누적 학습량 등) 시각화 제공
7. **마이페이지**
    - streak 정보, 계정 설정 등을 확인

---

### 🔸 주요 화면(라우팅) 구조

```
app/
├── (auth)/                 # 로그인/회원가입
│   ├── login.tsx
│   └── sign-up.tsx

├── (tabs)/                 # 바텀 탭 구조
│   ├── index.tsx           # 홈
│   ├── problem/            # 문제 폴더 리스트 및 문제 상세
│   ├── record/             # 풀이 기록 목록
│   ├── total/              # 통계 페이지: 처음 기획으로 인해 share폴더로 작성
│   └── setting/            # 설정

├── (solved)/               # 문제 풀이 결과
└── _layout.tsx             # 각 모드 문제 풀이 결과 구성
```

---

### 🔸 Firestore 데이터 구조

```
user_info/
  └── {userId}/
      ├── UserInfoDoc
      │   ├── currentStreak: number         // 연속 학습 일수
      │   ├── lastLearnedDate: string       // 마지막 학습일 (yyyy-MM-dd)
      │   ├── longestStreak: number         // 최장 연속 일수
      │
      ├── learning_records/                 // 학습 출석 기록용
      │   └── {date}/
      │        └── learned: boolean       // 해당 날짜에 학습했는지 여부
      │
      └── solved_folders/
          └── {solvedFolderId}/
              ├── SolvedFolderDoc
              └── solved_problems/
                  └── {solvedProblemId}

folders/
  └── {folderId} → 사용자별 문제 폴더

problems/
  └── {problemId} → folderId와 연결됨
```

- `user_info/{userId}`: 사용자 정보 및 풀이 기록 보관
- `folders/`: 문제 폴더 모음
- `problems/`: 모든 문제 개별 저장, `folderId`로 연결
- `solved_folders/` 및 `solved_problems/`: 풀이 결과 저장용 구조

---

### Firestore 주요 타입 정의 (데이터 모델 상세)

### 🔸 문제 생성

> problems/{problemId}
> 
> - problems의 경우 내부 필드의 folderId를 통해 folders DB와 연결

```tsx
// 서술형 문제
export type DescriptiveInput = {
  type: "descriptive"; // 문제 유형: 서술형
  folderId: string;    // 연결된 folderId
  question: string;    // 사용자 작성 문제
  answer: string;      // 사용자 작성 정답
  imageUrl?: string;   // 문제 이미지
};

// 선택형 문제
export type ChoiceInput = {
  type: "choice";          // 문제 유형: 선택형
  folderId: string;        // 연결된 folderId
  question: string;        // 사용자 작성 문제
  options: ChoiceOption[]; // 문제 옵션 - 다지선다
  imageUrl?: string;       // 문제 이미지
};

export type ChoiceOption = {
  id: string;         // 문제 id (문제 리스트 구별용)
  text: string;       // 문제 내용
  isCorrect: boolean; // 문제 정답 여부
};

// 문제 입력 통합 타입
export type ProblemInput = DescriptiveInput | ChoiceInput;
```

---

### 🔸 풀이 모드 타입

```tsx
export type SolvedMode = "timed" | "free" | "review";
```

---

### 🔸 풀이 기록 - 상위 문서

> user_info/{userId}/solved_folders/{autoId}
> 

```tsx
export type SolvedFolderDoc = {
  folderId: string;             // 풀이한 폴더 ID
  mode: SolvedMode;             // 풀이 모드
  startedAt: Timestamp;         // 시작 시각 (Firestore Timestamp)
  submittedAt: Timestamp;       // 제출 시각
  date: string;                 // 날짜 문자열 (yyyy-MM-dd)
  totalCount: number;           // 전체 문제 수
  correctCount: number;         // 정답 개수
  accuracy: number;             // 정확도 (%)
  duration: number;             // 풀이 소요 시간 (초)
  timeLimit?: number;           // 타이머 모드 제한 시간 (선택)
}
```

---

### 🔸 풀이 기록 - 하위 문서

> solved_folders/{autoId}/solved_problems/{problemId}
> 

```tsx
export type SolvedProblemDoc = {
  problemId: string;
  index: number;
  type: "descriptive" | "choice";
  question: string;
  correctAnswer: string;
  userAnswer: string;
  isCorrect: boolean;
  memoText?: string;
  hasMemo?: boolean;
  options?: CheckOption[]; // 객관식일 경우 선택지 배열
};
```

```tsx
export type CheckOption = {
  id: string;
  text: string;
  isCorrect: boolean;
  userCheck: boolean;
};
```

---

### 🔹 사용자 정보 문서

> (user_info/{userId})
> 

```tsx
export type UserLearningInfo = {
  currentStreak: number;      // 현재 연속 학습 일수
  longestStreak: number;      // 최장 연속 학습 기록
  lastLearnedDate: string;    // 마지막 학습일 ("yyyy-MM-dd")
};
```

---

### 🔹 날짜별 학습 여부 기록

> (user_info/{userId}/learning_records/{date}) 기반
> 
> - {date}에 기록된 내용으로 학습 완료(출석) 여부 판단

```tsx
export type RecordType = {
  date: string;                 // "YYYY-MM-DD"
  day: "월" | "화" | "수" | "목" | "금" | "토" | "일";
  status: "attended" | "absent" | "upcoming"; // 학습 여부: 학습 | 미학습 | 예정
};

export type UserLearningRecord = {
  recordList: RecordType[];
};
```

---

### 🔹 통계 계산 관련 타입

> (user_info/{userId}) 내부의 전반적인 기록을 기반으로 계산
> 
> - 추후, 리팩토링 시 별도의 통계 저장 구조를 만들어 계산 방식이 아닌 불러오기 방식을 사용할 예정

```tsx
export type TotalLearningStats = {
  totalDuration: number;       // 학습 시간 (초)
  totalSolvedProblems: number; // 푼 문제 수
};

export type TotalLearningFullStats = {
  totalDuration: number;
  totalSolvedProblems: number;
  totalCorrect: number;
  totalIncorrect: number;
  averageAccuracy: number;
  modeCount: ModeCount;
};

export type ModeCount = {
  timed: number;
  free: number;
  review: number;
};
```

---

## 7. 기능 설명 (Features)

> QuizLab은 사용자가 직접 문제를 입력하고, 다양한 방식으로 문제를 풀이하며,
> 
> 
> 그 학습 데이터를 저장하고 분석할 수 있는
> 
> **자기주도 학습 앱** 입니다.
> 
> 아래는 각 기능 별로 주요 기능을 정리하였습니다.
> 

| 기능 이름 | 설명 |
| --- | --- |
| 🗂 문제 폴더 생성 | 사용자가 자격증/과목 등 주제별로 문제 폴더를 만들고, 문제를 분류하여 체계적으로 관리할 수 있습니다. |
| ✍️ 문제 입력 | 각 폴더에 주관식 또는 객관식 문제를 직접 작성하며, 객관식의 경우 보기와 정답 여부를 설정할 수 있습니다. |
| 🧭 풀이 모드 선택 | 자유 풀이 / 시간 제한 모드 / 해설 복습 모드 중 원하는 방식으로 문제 풀이 방식을 선택할 수 있습니다. |
| 🧩 실시간 풀이 | 문제를 한 문제씩 순차적으로 표시하며, 사용자 입력을 기록하고 다음 문제로 자연스럽게 넘어갑니다. |
| 💾 풀이 결과 저장 | 각 풀이 시도는 Firestore에 자동 저장되며, 정답률, 맞은 문제 수, 풀이 시간, 풀이 모드 등의 통계가 함께 저장됩니다. |
| ✏️ 오답노트 기능 | 틀린 문제에 대해 메모를 남기고, 나중에 다시 복습할 수 있는 오답노트 기능을 제공합니다. |
| 📊 통계 확인 | 전체 학습 시간, 정답률, 연속 학습일(streak), 풀이 모드별 학습 분포 등 다양한 통계 지표를 시각적으로 확인할 수 있으며, 폴더별 정답률 변화 추이도 추적 가능합니다. |
| 📅 출석 체크 기능 | 날짜별 학습 여부를 기록하여 주간/월간 출석률을 보여주고, 이를 기반으로 연속 학습 streak를 관리할 수 있습니다. |
| ⚙️ 설정 (마이페이지) | 계정 정보, streak, 전체 요약 통계를 확인하고 앱 환경을 관리할 수 있습니다. |

---

## 8. 도전 과제 및 해결책 (Challenges & Solutions)

### 1) Expo SDK 업데이트 이슈

가장 큰 도전은 **Expo SDK 52에서 53으로의 버전 업데이트**였다.

개발 막바지에 메이저 버전이 출시되면서 일부 패키지의 호환성 문제가 발생했고,

빌드 오류와 설정 변경 이슈로 인해 전체 구조와 의존성 정리에 대한 고민이 필요해졌다.

이 문제는 단순히 버전 숫자의 문제가 아니라,

- **“어떤 기준으로 프로젝트를 유지할 것인가”** 에 대한 근본적인 리팩토링 필요성으로 이어졌다.

📌 **해결**: 이후 리팩토링 시 Expo SDK 53을 기준으로 전체 구조를 다시 잡고,

버전 호환성과 관련된 문서를 정리하며 재설계를 진행 중이다.

---

### 2) 폴더 구조와 Firestore 설계 오류

처음에는 문제 폴더와 풀이 기록을 간단한 구조로 구상했으나,

프로젝트를 진행하면서 **“문제 → 풀이 결과 → 기록 저장”**의 흐름이

기존 구조에 잘 맞지 않는다는 문제에 직면했다.

- 폴더 구조를 중간에 변경하게 되었고
- 문제 컬렉션과 풀이 결과 간 관계가 불분명해져
- **Firestore 설계를 전면적으로 수정하는 작업**이 필요했다

📌 **해결**: 문제와 폴더는 전역 컬렉션으로 관리하고,

사용자 풀이 결과는 `user_info/{userId}` 하위에 저장하는 구조로 변경.

이러한 구조적 재설계를 통해 **데이터 정합성과 유지보수성**을 확보하게 되었다.

---

### 3) 컨벤션 미지정으로 인한 혼란

초기에는 컨벤션 가이드를 정하지 않고 개발을 시작했기 때문에,

- 컴포넌트 네이밍, 폴더 구조, 타입 정의 등에서 일관성이 부족했고,
- 중간중간 폴더 이동 및 파일 재배치가 발생하며 개발 속도에 영향을 주었다.

📌 **해결**: 리팩토링 이후에는 **폴더 구조 명세 + 타입 가이드 + 코드 컨벤션**을 문서화하여

앞으로 프로젝트 구조가 변경되지 않도록 기준을 마련할 계획이다.

---

## 9. 결과 및 성과 (Results & Outcomes)

이번 프로젝트의 가장 큰 성과는 **기획한 모든 주요 기능을 실제로 구현해냈다는 점**이다.

원하는 방식으로 문제를 생성하고, 풀이 모드를 설정하며, 결과를 저장하고 통계를 확인하는 일련의 흐름을

**기획 → 개발 → 구현**까지 스스로 완성해냈다는 것은 큰 만족으로 이어졌다.

또한 이번 프로젝트는 단순한 토이 프로젝트를 넘어,

**기능 요구사항이 분명하고, 데이터 흐름이 복잡한 앱을 개인이 온전히 설계하고 완성한 경험**이었다.

그동안은 소규모 실습형 프로젝트 위주로 진행해왔다면,

이번에는 사용자 플로우, 상태 관리, 데이터베이스 구조까지 실제 앱에 가까운 수준으로 설계하고 구축했다는 점에서

**개발자로서 한 단계 성장할 수 있었던 계기**가 되었다.

특히 Firestore를 기반으로 하는 데이터베이스 구조를 처음부터 직접 설계하면서,

단순히 데이터를 저장하는 것이 아닌 **"어떻게 구조화하면 유지보수와 확장이 쉬운가"**에 대해

깊이 고민하는 시간을 가질 수 있었다. 이는 기술적인 성과뿐만 아니라 **사고 방식의 변화**로도 이어졌다.

---

## 10. 향후 계획 (Future Plans)

QuizLab은 기능 중심으로 빠르게 구현되었기에,

이번 1차 회고를 바탕으로 다음과 같은 **구조적 리팩토링 및 관리 체계 개선**을 계획하고 있다.

### < 리팩토링 핵심 방향 >

1. **컨벤션 가이드 정립**
    - 폴더 구조, 타입 정의, Firestore 데이터 스키마에 대한 기준을 명확히 문서화
    - `CONVENTION_GUIDE.md`, `FIREBASE_STRUCTURE.md`, `types/` 내 공통 타입 통합 등 계획
    
2. **컴포넌트 위치 및 역할 분리**
    - 각 화면별 구성 요소를 분리하여 재사용성과 유지보수성을 높임
    - Figma 디자인도 컴포넌트 단위로 분리 및 수정하여 실제 코드 구조와 일치하도록 조정
    - 컴포넌트와 관련된 폴더 구조 (`components/screen/`, `components/ui/` 등) 통일
    
3. **입력 UI 요소 가이드 명세**
    - TextInput, Button, Modal 등 반복적으로 사용하는 입력 컴포넌트에 대한 UI/UX 가이드 작성
    - 폼 유효성, 포커스 처리, 기본 스타일 등 일관성 확보
    
4. **외부 라이브러리 관리 체계**
    - 향후 설치하는 모든 라이브러리는 설치 이유와 버전 정보를 정리
    - `tech-stack.md` 파일에 정기적으로 반영하여 추후 유지보수에 활용
    
5. **버전 관리 및 협업 실천**
    - Git 기반 브랜치 전략 확립 (예: `feature/`, `hotfix/`, `refactor/`)
    - 모든 작업은 **주기적인 커밋 + Pull Request 리뷰 루틴**으로 유지
    - 변경 이력 및 설계 변경점은 이슈 기반으로 기록
    

---

## 11. 회고 및 배운 점 (Reflections & Lessons Learned)

이번 프로젝트는 기능 구현을 중심으로 빠르게 완성해나가는 과정이었지만,

진행하면서 다양한 시행착오를 겪었고, 이를 통해 많은 인사이트를 얻을 수 있었다.

특히 다음과 같은 **개선 사항들**을 직접 경험하며,

앞으로 더 나은 프로젝트 구조와 협업 방식을 고민하게 되었다.

### 1) 프로젝트를 통해 얻은 교훈

- **구조는 초반이 가장 중요하다**:
    
    폴더 구조, 데이터 설계가 불완전할 경우, 전체 흐름이 흔들릴 수 있으며
    
    결국 전면 리팩토링으로 이어진다는 걸 절감했다.
    

- **버전 업데이트는 가볍게 볼 문제가 아니다**:
    
    Expo SDK 53으로의 전환에서 겪은 혼란은
    
    프로젝트 유지보수를 고려한 개발 환경 관리의 중요성을 깨닫게 해주었다.
    

- **컨벤션 없이 시작한 프로젝트는 중간에 무너진다**:
    
    네이밍, 타입 관리, 파일 위치 등은 초반에 명확히 정해두는 것이
    
    협업 뿐만 아니라 나 혼자 하는 프로젝트에도 도움이 된다.
    

---

### 2) 개선 아이디어 모음

1. **통계 계산 → 저장 구조 전환**
    - 매번 클라이언트에서 계산하던 통계를 `learning_summary` 문서에 저장하도록 개선
    - 전체 통계, 폴더별 통계, 일일 통계 등 효율적 관리
2. **컨벤션 가이드 문서화**
    - 폴더 구조, 타입 정의, Firestore 스키마를 명시한 공식 가이드 작성 예정
3. **컴포넌트 역할 정리 및 위치 통일**
    - Figma 디자인과 코드 구조를 일치시키고, 컴포넌트를 목적에 따라 분리/관리
4. **UI 입력 요소 스타일 가이드 작성**
    - TextInput, 버튼, 폼 등 기본 요소들에 대한 UX 컨벤션 마련
5. **외부 라이브러리 관리 체계 도입**
    - 도입 배경, 버전, 설정을 정리하여 `tech-stack.md`로 문서화
6. **버전 관리 전략 정비**
    - 주기적 커밋, 브랜치 전략 확립, PR 리뷰 루틴 실천
    

---

이러한 경험과 고민을 바탕으로, QuizLab은 단순한 프로젝트에서

**더 나은 개발 프로세스를 탐색하고 실천하는 연습장**이 되었다.

이번 경험이 향후 팀 프로젝트나 실무에서도 큰 도움이 될 것이라 생각한다.

---

## 12. 마무리 (Closing Remarks)

QuizLab은 단순히 “내가 쓰고 싶어서 만든 앱”에서 출발했지만,

결국에는 구조를 갖추고 기능을 충실히 구현한 **완성도 높은 학습 앱**으로 성장하게 되었다.

이 과정을 통해 기능 구현 능력은 물론, 데이터 구조 설계, 사용자 흐름 설계, 코드 관리 능력 등

전반적인 개발 실력을 한층 끌어올릴 수 있었다.

또한 프로젝트 진행 과정에서 다양한 사람들과의 협업과 피드백을 경험하며,

개발이라는 일이 혼자만의 결과물이 아닌, **소통과 개선의 반복이라는 점**도 체감할 수 있었다.

비록 이 프로젝트를 처음부터 다시 시작한다는 것이

겉으로는 미련해보일 수 있지만, 지금의 나는 이전보다 더 성장했고,

이번 리팩토링은 단지 리셋이 아니라 **더 높은 수준의 실무 적합성과 상업 가능성을 확인하기 위한 단계**라고 믿는다.

두 번의 장기 프로젝트 경험을 통해 나는 ***“성장하는 개발자”*** 라는 방향성을 명확히 가지게 되었고,

QuizLab은 그 여정 속에서 매우 중요한 이정표가 되었다.
