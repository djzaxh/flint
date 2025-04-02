'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { toast } from 'sonner'

export default function AuthCallback() {
    const router = useRouter()

    useEffect(() => {
        const hash = window.location.hash
        const params = new URLSearchParams(hash.slice(1))

        const access_token = params.get('access_token')
        const refresh_token = params.get('refresh_token')

        if (access_token && refresh_token) {
            supabase.auth.setSession({ access_token, refresh_token }).then(({ error }) => {
                if (error) {
                    toast.error('Login failed.')
                    router.push('/login')
                } else {
                    toast.success('You are now logged in 🎉')
                    router.push('/dashboard')
                }
            })
        } else {
            toast.error('Missing login tokens.')
            router.push('/login')
        }
    }, [router])

    return (
        <div className="min-h-screen flex items-center justify-center text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-black border-t-transparent" />
                Logging you in…
            </div>
        </div>
    )
}
