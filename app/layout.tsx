import type { Metadata } from "next";
import { Work_Sans, Raleway } from "next/font/google";
import "./globals.css";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/sonner";
import { AppChrome } from "@/components/layout/AppChrome";
import { Inter, Plus_Jakarta_Sans } from "next/font/google";
import { SpeedInsights } from "@vercel/speed-insights/next";

const workSans = Work_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-work-sans",
});

const raleway = Raleway({
  subsets: ["latin"],
  weight: ["600", "700", "800"],
  variable: "--font-raleway",
});

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });
const plusJakarta = Plus_Jakarta_Sans({ 
  subsets: ["latin"], 
  variable: "--font-display",
});

export const metadata: Metadata = {
  title: {
    template: "%s | Auronex Media",
    default: "Auronex Media - The Modern Editorial System",
  },
  description: "A fast, beautiful, and complete editorial system for modern publishing.",
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${workSans.variable} ${raleway.variable} antialiased bg-[#FAF9F6] text-[#0d1619] font-sans`}>
        <TooltipProvider>
          <AppChrome>{children}</AppChrome>
          <Toaster position="top-right" />
        </TooltipProvider>
        <SpeedInsights />
      </body>
    </html>
  );
}
