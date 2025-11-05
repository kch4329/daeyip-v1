import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "대입 정시모집 합격 예측 서비스",
  description: "수능 성적 기반 대학 정시모집 합격 가능성 예측 서비스",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className="antialiased font-sans">
        {children}
      </body>
    </html>
  );
}
