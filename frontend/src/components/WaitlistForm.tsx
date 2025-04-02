'use client'

import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'

export default function WaitlistForm() {
    const [email, setEmail] = useState('')
    const [loading, setLoading] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!email) return toast.error('Enter your email.')

        setLoading(true)

        const res = await fetch('/api/waitlist', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email }),
        })

        setLoading(false)

        if (res.ok) {
            toast.success('You’re on the waitlist!')
            setEmail('')
        } else {
            const { error } = await res.json()
            toast.error(error || 'Something went wrong.')
        }
    }

    return (
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto mt-6">
            <Input
                type="email"
                placeholder="you@email.com"
                className="w-full"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
            />
            <Button type="submit" className="w-full sm:w-auto" disabled={loading}>
                {loading ? 'Joining...' : 'Join'}
            </Button>
        </form>
    )
}
