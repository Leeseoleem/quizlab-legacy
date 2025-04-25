// types/react-native-html-to-pdf.d.ts

declare module "react-native-html-to-pdf" {
  type ConvertOptions = {
    html: string;
    fileName?: string;
    directory?: string;
    base64?: boolean;
  };

  type ConvertResult = {
    filePath: string;
    base64?: string;
  };

  export function convert(options: ConvertOptions): Promise<ConvertResult>;

  const HTMLtoPDF: { convert: typeof convert };

  export default HTMLtoPDF;
}
