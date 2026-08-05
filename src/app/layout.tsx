import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";
import AuthProvider from "@/context/AuthContext";
import AuthControls from "@/components/AuthControls";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
});

export const metadata: Metadata = {
  title: "CareerVerse | Premium AI Career Guidance & Mentorship",
  description: "Discover your ideal career path using the power of advanced AI recommendations, ATS resume analysis, custom roadmaps, and 24/7 mentoring.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${outfit.variable} h-full antialiased dark`}>
      <body className="min-h-full flex flex-col font-sans bg-[#030014] text-slate-100 selection:bg-purple-500/30 selection:text-purple-200">
        {/* Moving Aurora Background Effect */}
        <div className="aurora-bg">
          <div className="aurora-blur aurora-1"></div>
          <div className="aurora-blur aurora-2"></div>
          <div className="aurora-blur aurora-3"></div>
        </div>
        <AuthProvider>
          <AuthControls />
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
