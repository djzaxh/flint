import type { Metadata } from 'next'
import { Sora, Urbanist } from 'next/font/google'
import { Toaster } from '@/components/ui/sonner'
import { ThemeProvider } from '@/components/ThemeProvider'
import AnimatedBackground from '@/components/AnimateBackground'

const urbanist = Urbanist({
  subsets: ['latin'],
  display: 'swap',
  weight: ['400', '500', '600', '700'],
  variable: '--font-urbanist',
})

const sora = Sora({
  subsets: ['latin'],
  display: 'swap',
  weight: ['400', '500', '600', '700'],
  variable: '--font-sora',
})

export const metadata: Metadata = {
  title: 'GetStrong',
  description: 'GetStrong - Fuel smarter. Live better.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning className={`${urbanist.variable} ${sora.variable}`}>
      <body className="bg-background text-foreground dark:text-white transition-colors">
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <div className="relative min-h-screen w-full overflow-x-hidden">
          {/* 🔮 Background effect */}
          <AnimatedBackground />

          {/* 🧱 Actual page content */}
          <div className="relative z-10">
            {children}
          </div>
        </div>

        <Toaster richColors closeButton />
      </ThemeProvider>
      </body>
    </html>
  )
}
