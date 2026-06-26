import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as SonnerToaster } from "@/components/ui/sonner";
import { ThemeProvider } from "@/components/theme-provider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SayOne HRIS — Intelligent Career Portal",
  description:
    "SayOne HRIS Career Portal — a candidate-first job board with an AI career coach, application pipeline tracking, and a beautifully crafted apply experience.",
  keywords: [
    "SayOne HRIS",
    "Career Portal",
    "Job Search",
    "AI Career Coach",
    "Airee Coach",
    "Candidate Portal",
    "Apply Online",
    "Jakarta Jobs",
    "HR Software",
  ],
  authors: [{ name: "SayOne HRIS" }],
  icons: {
    icon: "https://z-cdn.chatglm.cn/z-ai/static/logo.svg",
  },
  openGraph: {
    title: "SayOne HRIS — Intelligent Career Portal",
    description:
      "Find a place where you truly belong. Browse open roles, track applications, and chat with Airee Coach.",
    siteName: "SayOne HRIS",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Toaster />
          <SonnerToaster position="top-center" richColors closeButton />
        </ThemeProvider>
      </body>
    </html>
  );
}
