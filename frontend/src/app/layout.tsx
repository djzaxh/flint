import "./globals.css";
import type { Metadata } from "next";
import { Sora, Urbanist } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "@/components/ThemeProvider";
import SupabaseProvider from "@/components/providers/SupabaseProvider";
import OrganizationSchema from "@/components/OrganizationSchema";

const urbanist = Urbanist({
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700"],
  variable: '--font-urbanist',
});

const sora = Sora({
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700"],
  variable: '--font-sora',
});

export const metadata: Metadata = {
  title: "GetStrong | AI-Powered Nutrition Coach",
  description: "GetStrong helps you build healthier habits with AI-powered nutrition tracking and personalized coaching. Fuel smarter. Live better.",
  keywords: ["nutrition app", "AI nutritionist", "diet tracking", "healthy eating", "personalized nutrition", "health coach"],
  authors: [{ name: "GetStrong Team" }],
  creator: "GetStrong",
  publisher: "GetStrong",
  formatDetection: {
    email: false,
    telephone: false,
    address: false,
  },
  metadataBase: new URL("https://getstrong.ai"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "GetStrong | AI-Powered Nutrition Coach",
    description: "GetStrong helps you build healthier habits with AI-powered nutrition tracking and personalized coaching.",
    url: "https://getstrong.ai",
    siteName: "GetStrong",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/seo/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "GetStrong - AI-Powered Nutrition Coach",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "GetStrong | AI-Powered Nutrition Coach",
    description: "GetStrong helps you build healthier habits with AI-powered nutrition tracking and personalized coaching.",
    images: ["/seo/twitter-image.jpg"],
    creator: "@getstrong",
  },
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
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning className={`${urbanist.variable} ${sora.variable}`}>
      <OrganizationSchema />
      <body className="bg-background text-foreground dark:text-white transition-colors">
        <SupabaseProvider>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            {children}
            <Toaster richColors closeButton />
          </ThemeProvider>
        </SupabaseProvider>
      </body>
    </html>
  );
}
