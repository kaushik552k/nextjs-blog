import type { Metadata } from "next";
import { Poppins, Fira_Code } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "next-themes";
import StructuredData from "./components/StructuredData";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const firaCode = Fira_Code({
  variable: "--font-fira-code",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL('https://kaushikcodes.in'),
  title: {
    default: "Kaushik Codes | Software Engineer & Tech Writer",
    template: "%s | Kaushik Codes"
  },
  description: "Welcome to Kaushik Codes - A digital garden by Kaushik Dutta featuring tutorials on web development, system design, AI, and coding best practices.",
  keywords: [
    "kaushik codes",
    "kaushik dutta",
    "software engineer",
    "web developer",
    "tech blog",
    "coding tutorials",
    "system design",
    "javascript",
    "react",
    "next.js",
    "AI",
    "programming"
  ],
  authors: [{ name: "Kaushik Dutta", url: "https://kaushikcodes.in" }],
  creator: "Kaushik Dutta",
  publisher: "Kaushik Codes",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://kaushikcodes.in",
    siteName: "Kaushik Codes",
    title: "Kaushik Codes | Software Engineer & Tech Writer",
    description: "Welcome to Kaushik Codes - A digital garden by Kaushik Dutta featuring tutorials on web development, system design, AI, and coding best practices.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Kaushik Codes - Software Engineer & Tech Writer"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "Kaushik Codes | Software Engineer & Tech Writer",
    description: "Welcome to Kaushik Codes - A digital garden by Kaushik Dutta featuring tutorials on web development, system design, AI, and coding best practices.",
    images: ["/twitter-card.jpg"],
    creator: "@kaushikcodes"
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code', // Add your actual verification code
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <StructuredData type="person" />
        <StructuredData type="website" />
      </head>
      <body
        className={`${poppins.variable} ${firaCode.variable} antialiased noise-overlay`}
      >
        {/* ThemeProvider wraps EVERYTHING (Admin + Main) so dark mode works everywhere */}
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
