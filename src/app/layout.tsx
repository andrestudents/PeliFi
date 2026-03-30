import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { WalletProvider } from "@/context/WalletContext";
import { Toaster } from "@/components/ui/sonner";
import { LoginDialogWrapper } from "@/components/auth/LoginDialogWrapper";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "PeliFi - Predict. Stake. Earn.",
  description: "Pasang prediksi YES/NO di pasar global. Dana kamu bekerja menghasilkan yield selama event berlangsung.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <WalletProvider>
          {children}
          <LoginDialogWrapper />
          <Toaster />
        </WalletProvider>
      </body>
    </html>
  );
}
