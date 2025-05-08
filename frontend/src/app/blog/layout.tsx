import type { Metadata } from "next";
import { Sora, Urbanist } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "@/components/ThemeProvider";
import AnimatedBackground from "@/components/AnimateBackground";
import './blog.css';

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
  title: "GetStrong Blog | Nutrition & Health Insights",
  description: "Explore the latest nutrition science, healthy eating tips, and wellness advice from GetStrong's team of experts. Fuel smarter. Live better.",
  keywords: ["nutrition blog", "healthy eating tips", "wellness advice", "nutrition science", "diet tips", "health insights"],
  openGraph: {
    title: "GetStrong Blog | Nutrition & Health Insights",
    description: "Explore the latest nutrition science, healthy eating tips, and wellness advice from GetStrong's team of experts.",
    url: "https://getstrong.ai/blog",
    siteName: "GetStrong",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/seo/blog-og-image.jpg",
        width: 1200,
        height: 630,
        alt: "GetStrong Blog - Nutrition & Health Insights",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "GetStrong Blog | Nutrition & Health Insights",
    description: "Explore the latest nutrition science, healthy eating tips, and wellness advice from GetStrong's team of experts.",
    images: ["/seo/blog-twitter-image.jpg"],
  },
  alternates: {
    canonical: "/blog",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning className={`${urbanist.variable} ${sora.variable}`}>
      <div className="bg-background text-foreground dark:text-white transition-colors">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <div className="relative min-h-screen w-full overflow-x-hidden">
            {/* 🔮 Background effect */}
            <AnimatedBackground />

            {/* 🧱 Actual page content */}
            <div className="relative z-10 typography-improved">{children}</div>
          </div>

          <Toaster richColors closeButton />
        </ThemeProvider>
      </div>
    </html>
  );
}
