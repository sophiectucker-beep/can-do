import type { Metadata } from "next";
import { Nunito, Quicksand } from "next/font/google";
import "./globals.css";

const nunito = Nunito({
  variable: "--font-nunito",
  subsets: ["latin"],
  weight: ["200", "300", "400", "500"],
});

const quicksand = Quicksand({
  variable: "--font-logo",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

export const metadata: Metadata = {
  title: "can do - find the perfect date together",
  description: "Create a shared calendar and find dates that work for everyone",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${nunito.variable} ${quicksand.variable} antialiased`} style={{ fontFamily: 'var(--font-nunito), sans-serif' }}>
        {children}
      </body>
    </html>
  );
}
