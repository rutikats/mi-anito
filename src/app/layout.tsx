import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "MiAniTo | לומדים להכיר את עצמנו",
  description: "שאלון אישיות ידידותי לתלמידים"
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="he" dir="rtl">
      <body>{children}</body>
    </html>
  );
}
