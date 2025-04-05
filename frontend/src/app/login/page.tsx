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

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const handleLogin = async () => {
    setLoading(true)
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    setLoading(false)

    if (error) {
      toast.error(error.message)
    } else {
      toast.success('Welcome back!')
      router.push('/dashboard')
    }
  }

  const handleGoogleLogin = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/dashboard`,
      },
    })
    if (error) toast.error(error.message)
  }

  return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="w-full max-w-md space-y-6">
          {/* Logo centered above card */}
          <div className="flex justify-center mb-6">
            <a href="/">
              <img
                  src="/logo.png"
                  alt="Flint logo"
                  className="h-10 w-auto hover:opacity-90 transition"
              />
            </a>
          </div>

          {/* Login card */}
          <Card>
            <CardHeader>
              <CardTitle>Log In to Flint</CardTitle>
              <CardDescription>Fuel smarter. Live better.</CardDescription>
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
                  onClick={handleLogin}
                  disabled={loading || !email || !password}
                  className="w-full"
              >
                {loading ? 'Logging in…' : 'Log In'}
              </Button>

              <div className="relative py-2">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="px-2 text-muted-foreground">Or</span>
                </div>
              </div>

              <Button
                  variant="outline"
                  className="w-full"
                  onClick={handleGoogleLogin}
              >
                Sign in with Google
              </Button>

              <p className="text-sm text-center text-muted-foreground mt-2">
                Don’t have an account?{' '}
                <a
                    href="/signup"
                    className="hover:underline hover:text-blue-500 transition"
                >
                  Sign up
                </a>
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
  )
}
