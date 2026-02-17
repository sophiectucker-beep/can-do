import type { Metadata } from "next";
import { Nunito } from "next/font/google";
import localFont from "next/font/local";
import { Analytics } from "@vercel/analytics/react";
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
  metadataBase: new URL("https://cando.you"),
  title: {
    default: "Can Do - Find the Perfect Date Together",
    template: "%s | Can Do",
  },
  description:
    "Create a shared calendar and find dates that work for everyone. Free group scheduling tool - no sign-up required. Perfect for planning events, meetings, and get-togethers.",
  keywords: [
    "group scheduling",
    "shared calendar",
    "find available dates",
    "meeting planner",
    "event scheduling",
    "doodle alternative",
    "when2meet alternative",
    "free scheduling tool",
    "group date finder",
    "availability poll",
  ],
  authors: [{ name: "Can Do" }],
  creator: "Can Do",
  publisher: "Can Do",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://cando.you",
    siteName: "Can Do",
    title: "Can Do - Find the Perfect Date Together",
    description:
      "Create a shared calendar and find dates that work for everyone. Free group scheduling - no sign-up required.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Can Do - Find the Perfect Date Together",
    description:
      "Create a shared calendar and find dates that work for everyone. Free group scheduling - no sign-up required.",
  },
  alternates: {
    canonical: "https://cando.you",
  },
  category: "Productivity",
};

// JSON-LD structured data for SEO and AEO (AI Engine Optimization)
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Can Do",
  url: "https://cando.you",
  description:
    "Create a shared calendar and find dates that work for everyone. Free group scheduling tool - no sign-up required.",
  applicationCategory: "ProductivityApplication",
  operatingSystem: "Any",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
  },
  featureList: [
    "Create shared calendars",
    "Vote on available dates",
    "See who can make which dates",
    "No account required",
    "Share via link",
    "Works on mobile and desktop",
  ],
  screenshot: "https://cando.you/opengraph-image",
  aggregateRating: {
    "@type": "AggregateRating",
    ratingValue: "5",
    ratingCount: "1",
  },
};

// FAQ structured data for AEO - helps AI assistants answer questions about the app
const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "What is Can Do?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Can Do is a free group scheduling tool that helps you find dates that work for everyone. Create a shared calendar, invite participants via link, and see which dates have the most availability.",
      },
    },
    {
      "@type": "Question",
      name: "Do I need to create an account to use Can Do?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "No, Can Do requires no sign-up or account. Simply create an event, share the link with your group, and start finding available dates together.",
      },
    },
    {
      "@type": "Question",
      name: "How does Can Do work?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Create an event with a title, select potential dates on the calendar, and share the link. Participants click dates they're available, and Can Do shows which dates work for the most people.",
      },
    },
    {
      "@type": "Question",
      name: "Is Can Do free?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes, Can Do is completely free to use with no hidden fees or premium tiers.",
      },
    },
    {
      "@type": "Question",
      name: "What is Can Do best used for?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Can Do is perfect for planning group events, meetings, parties, reunions, trips, team activities, or any situation where you need to find a date that works for multiple people.",
      },
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
        />
      </head>
      <body
        className={`${nunito.variable} ${hankyDemo.variable} antialiased`}
        style={{ fontFamily: "var(--font-nunito), sans-serif" }}
      >
        {children}
        <Analytics />
      </body>
    </html>
  );
}
