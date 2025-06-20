import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "4TUNEZ - CLOUD | เว็บฝากรูปภาพฟรี 24 ชั่วโมง สะดวก รวดเร็ว ปลอดภัย",
  description: "4TUNEZ - CLOUD บริการเว็บฝากรูปภาพออนไลน์ฟรี ตลอด 24 ชั่วโมง รองรับ JPG, PNG, GIF อัปโหลดง่ายและรวดเร็ว ใช้งานได้ทุกที่ทุกเวลา",
  keywords: [
    "เว็บฝากรูป",
    "ฝากรูปฟรี",
    "ฝากรูปภาพออนไลน์",
    "อัปโหลดรูป",
    "4TUNEZ CLOUD",
    "ฝากรูป 24 ชั่วโมง",
    "ฝากรูป JPG PNG GIF",
    "บริการฝากรูปภาพ",
    "ฝากรูปสะดวก",
    "ฝากรูปเร็ว"
  ],
  viewport: "width=device-width, initial-scale=1",
  icons: {
    icon: "/favicon.ico",
  },
  openGraph: {
    title: "4TUNEZ - CLOUD | เว็บฝากรูปภาพฟรี 24 ชั่วโมง",
    description: "บริการฝากรูปภาพออนไลน์ฟรี รองรับ JPG, PNG, GIF ใช้งานง่าย รวดเร็ว และปลอดภัยตลอด 24 ชั่วโมง",
    url: "https://localhost:3000/", // เปลี่ยนเป็น URL จริงของคุณ
    siteName: "4TUNEZ - CLOUD",
    locale: "th_TH",
    type: "website",
    images: [
      {
        url: "https://localhost:3000/og-image.png", // ใส่ลิงก์รูปภาพสำหรับแชร์ใน social
        width: 1200,
        height: 630,
        alt: "4TUNEZ - CLOUD เว็บฝากรูปภาพฟรี",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "4TUNEZ - CLOUD | เว็บฝากรูปภาพฟรี 24 ชั่วโมง",
    description: "ฝากรูปภาพออนไลน์ฟรี รองรับ JPG, PNG, GIF อัปโหลดง่ายและรวดเร็ว",
    images: ["https://localhost:3000/twitter-image.png"], // เปลี่ยนตามจริง
    creator: "@yourtwitterhandle", // ถ้ามี
  },
  robots: {
    index: true,
    follow: true,
  },
  metadataBase: new URL("https://localhost:3000/"), // ใส่ domain จริง
  alternates: {
    canonical: "https://localhost:3000/",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="th">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}