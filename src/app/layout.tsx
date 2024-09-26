import type {Metadata} from "next";
// import localFont from "next/font/local";
// import { Lexend } from "next/font/google";
import {Inter} from "next/font/google";
import "@/styles/globals.css";
import {ReactNode} from "react";
import {cn} from "@/lib/utils";
import App from "@/components/app";

// const lexend = Lexend({ subsets: ["latin"], variable: "--font-lexend" });

const inter = Inter({subsets: ["latin"]});

export const metadata: Metadata = {
  title: {
    template: "%s | Initiative Demo",
    default: "Initiative Demo",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={cn("min-h-screen antialiased bg-background", inter.className)}>
        <App>{children}</App>
      </body>
    </html>
  );
}
