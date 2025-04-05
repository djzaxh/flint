'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import ThemeToggle from '@/components/ThemeToggle'
import Link from 'next/link'

type NavbarProps = {
    showLogin?: boolean // 👈 when true, shows Login instead of Log out
}

export default function Navbar({ showLogin = false }: NavbarProps) {
    const router = useRouter()
    const [mounted, setMounted] = useState(false)

    useEffect(() => setMounted(true), [])

    const handleLogout = async () => {
        await supabase.auth.signOut()
        router.push('/login')
    }

    if (!mounted) return null

    return (
        <nav className="w-full border-b px-4 py-3 flex justify-between items-center bg-background text-foreground transition-colors">
            <Link href="/" className="flex items-center gap-2 font-semibold text-lg">
                <img src="/logo.png" alt="GetStrong" className="h-7 w-auto" />
                GetStrong
            </Link>

            <div className="flex items-center gap-2">
                <a
                    href="/blog"
                    className="relative inline-block text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
  <span className="after:absolute after:left-0 after:-bottom-0.5 after:h-[2px] after:w-0 after:bg-current after:transition-all after:duration-300 hover:after:w-full">
    Blog
  </span>
                </a>

                <ThemeToggle />
                {showLogin ? (
                    <Button asChild variant="outline" size="sm">
                        <Link href="/login">Login</Link>
                    </Button>
                ) : (
                    <Button variant="outline" size="sm" onClick={handleLogout}>
                        Log out
                    </Button>
                )}
            </div>
        </nav>


    )
}
