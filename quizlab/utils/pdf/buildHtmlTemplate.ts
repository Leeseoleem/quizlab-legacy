// HTML 템플릿 생성 함수
import { SolvedProblemDoc, SolvedFolderDoc } from "@/types/solved";
import RNHTMLtoPDF from "react-native-html-to-pdf";
import * as Sharing from "expo-sharing";

export const buildHtmlTemplate = (
  totalData: SolvedFolderDoc, // 문제 풀이 결과
  problems: SolvedProblemDoc[] // 문제 풀이 내용
) => {
  return `
    <html>
      <head>
        <style>
          body { font-family: sans-serif; padding: 16px; }
          h2, h3 { color: #FF6600; }
          .correct { color: green; }
          .wrong { color: red; }
          .memo-box { background-color: #f0f0f0; padding: 8px; border-radius: 6px; }
        </style>
      </head>
      <body>
        <h2>📌 학습 결과</h2>
        <p><strong>날짜:</strong> ${totalData.date}</p>
        <p><strong>풀이 모드:</strong> ${totalData.mode}</p>
        <p><strong>정답률:</strong> ${totalData.correctCount}/${
    totalData.totalCount
  } (${totalData.accuracy}%)</p>
        <p><strong>소요 시간:</strong> ${totalData.duration}</p>
        <hr />
        ${problems
          .map((p, i) => {
            const optionsHTML =
              p.type === "choice"
                ? `<ul>${p.options
                    ?.map(
                      (opt) =>
                        `<li>${opt.text}${opt.isCorrect ? " ✅" : ""}</li>`
                    )
                    .join("")}</ul>`
                : "";
            return `
              <div>
                <h3>${i + 1}. ${p.question}</h3>
                <p><strong>정답 여부:</strong> <span class="${
                  p.isCorrect ? "correct" : "wrong"
                }">${p.isCorrect ? "맞음" : "틀림"}</span></p>
                ${optionsHTML}
                <p><strong>사용자 답변:</strong> ${p.userAnswer}</p>
                <p><strong>정답:</strong> ${p.correctAnswer}</p>
                <p><strong>메모:</strong></p>
                <div class="memo-box">${
                  p.memoText || "작성된 메모가 없습니다."
                }</div>
                <hr />
              </div>
            `;
          })
          .join("")}
      </body>
    </html>
  `;
};

// 폴더 저장
export async function generatePDF(
  totalData: SolvedFolderDoc, // 문제 풀이 결과
  problems: SolvedProblemDoc[] // 문제 풀이 내용
): Promise<string | null> {
  console.log("RNHTMLtoPDF 모듈:", RNHTMLtoPDF);

  const htmlContent = buildHtmlTemplate(totalData, problems);

  const file = await RNHTMLtoPDF.convert({
    html: htmlContent,
    fileName: "quizlab_problems",
    directory: "Documents", // Android는 실제 Documents 폴더, iOS는 앱 내부 Documents
  });

  console.log("📄 PDF 파일 경로:", file.filePath); // ← 반드시 확인해볼 것

  return file?.filePath ?? null;
}

/**
 * 생성된 PDF를 공유 앱(카톡, 이메일 등)으로 공유
 */
export async function sharePDF(filePath: string) {
  if (await Sharing.isAvailableAsync()) {
    await Sharing.shareAsync(filePath);
  } else {
    alert("공유 기능을 사용할 수 없습니다.");
  }
}
