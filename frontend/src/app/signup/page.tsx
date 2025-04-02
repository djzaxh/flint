'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import {
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
    CardContent,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'

export default function SignupPage() {
    const router = useRouter()
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)

    const handleSignup = async () => {
        setLoading(true)
        const { error } = await supabase.auth.signUp({ email, password })
        setLoading(false)

        if (error) {
            toast.error(error.message)
        } else {
            toast.success('Account created! Redirecting…')
            router.push('/dashboard')
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center px-4">
            <div className="w-full max-w-md space-y-6">
                {/* Logo */}
                <div className="flex justify-center mb-6">
                    <a href="/">
                        <img
                            src="/logo.png"
                            alt="Flint logo"
                            className="h-10 w-auto hover:opacity-90 transition"
                        />
                    </a>
                </div>

                {/* Signup Card */}
                <Card>
                    <CardHeader>
                        <CardTitle>Sign Up</CardTitle>
                        <CardDescription>Create your Flint account</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="you@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                disabled={loading}
                            />
                        </div>

                        <div>
                            <Label htmlFor="password">Password</Label>
                            <Input
                                id="password"
                                type="password"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                disabled={loading}
                            />
                        </div>

                        <Button
                            onClick={handleSignup}
                            disabled={loading || !email || !password}
                            className="w-full"
                        >
                            {loading ? 'Creating account…' : 'Sign Up'}
                        </Button>

                        <p className="text-sm text-center text-muted-foreground mt-2">
                            Already have an account?{' '}
                            <a
                                href="/login"
                                className="hover:underline hover:text-blue-500 transition"
                            >
                                Log in
                            </a>
                        </p>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
