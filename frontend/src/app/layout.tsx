import "./globals.css";
import type { Metadata } from "next";
import { Mona_Sans } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "@/components/ThemeProvider";
import SupabaseProvider from "@/components/providers/SupabaseProvider";

const monaSans = Mona_Sans({
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "GetStrong",
  description: "GetStrong - Fuel smarter. Live better.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning className={monaSans.className}>
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
