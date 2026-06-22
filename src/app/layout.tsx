import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
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
  title: "Aurora ERP — Intelligent Enterprise Operating System",
  description:
    "Aurora is a next-generation ERP platform with a built-in AI copilot, live operations dashboard, and unified modules for finance, inventory, sales, HR, and projects.",
  keywords: [
    "Aurora ERP",
    "Enterprise Resource Planning",
    "AI ERP",
    "Business Intelligence",
    "Inventory Management",
    "Finance Dashboard",
  ],
  authors: [{ name: "Aurora Systems" }],
  icons: {
    icon: "https://z-cdn.chatglm.cn/z-ai/static/logo.svg",
  },
  openGraph: {
    title: "Aurora ERP — Intelligent Enterprise OS",
    description: "Next-generation ERP with AI copilot and live operations.",
    siteName: "Aurora ERP",
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
        </ThemeProvider>
      </body>
    </html>
  );
}
