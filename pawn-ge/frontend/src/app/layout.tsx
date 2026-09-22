import type { Metadata } from "next";
import { Inter, Geist_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Pawn.ge — All the pawn shops. One marketplace.",
  description:
    "Discover iPhones, MacBooks, Samsung, PlayStation and more from pawn shops across Georgia — all in one place. Compare offers, reserve and buy.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[#F1F0EB] text-[#171A18]">
        {children}
      </body>
    </html>
  );
}