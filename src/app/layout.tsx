import type { Metadata } from "next";
import "./globals.css";

// ✏️ 修改这里：每个 APP 替换自己的名称和描述
export const metadata: Metadata = {
  title: "体重一键记录(成就版) | 就算轻了一两，也是辉煌的一跃",
  description: "A lightweight tool for 体重一键记录(成就版).",
  keywords: ["APP_KEYWORD_1", "APP_KEYWORD_2"],
  openGraph: {
    title: "体重一键记录(成就版)",
    description: "A lightweight tool for 体重一键记录(成就版).",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body>{children}</body>
    </html>
  );
}
