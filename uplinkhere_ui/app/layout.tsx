import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ClerkProvider } from "@clerk/nextjs";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Uplink — Simple file requests",
  description: "Create secure upload links and collect files in one place.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
          <Toaster position="top-center" toastOptions={{ duration: 3500, style: { border: "1px solid #dde2de", borderRadius: "10px", boxShadow: "0 12px 32px rgba(28,44,35,.12)", color: "#17201c", fontSize: "13px" } }} />
          <TooltipProvider>{children}</TooltipProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
