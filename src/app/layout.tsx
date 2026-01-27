import type { Metadata } from "next";
import { Nunito } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";

const nunito = Nunito({
  variable: "--font-nunito",
  subsets: ["latin"],
  weight: ["200", "300", "400", "500"],
});

const hankyDemo = localFont({
  src: "../fonts/hanky-demo.regular.otf",
  variable: "--font-logo",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Can Do - find the perfect date together",
  description: "Create a shared calendar and find dates that work for everyone",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${nunito.variable} ${hankyDemo.variable} antialiased`} style={{ fontFamily: 'var(--font-nunito), sans-serif' }}>
        {children}
      </body>
    </html>
  );
}
