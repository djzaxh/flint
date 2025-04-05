import './globals.css'
import type { Metadata } from 'next'
import { Mona_Sans } from 'next/font/google'
import { Toaster } from '@/components/ui/sonner'
import { ThemeProvider } from '@/components/ThemeProvider'

const monaSans = Mona_Sans({
    subsets: ['latin'],
    display: 'swap',
    weight: ['400', '500', '600', '700'],
})

export const metadata: Metadata = {
    title: 'GetStrong',
    description: 'GetStrong - Fuel smarter. Live better.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en" suppressHydrationWarning className={monaSans.className}>
        <body className="bg-background text-foreground dark:text-white transition-colors">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            <div className="relative min-h-screen w-full overflow-x-hidden">
                {children}
            </div>

            <Toaster richColors closeButton />
        </ThemeProvider>
        </body>
        </html>
    )
}
