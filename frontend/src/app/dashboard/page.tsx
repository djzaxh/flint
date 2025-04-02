'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import Navbar from '@/components/Navbar'
import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { Input } from '@/components/ui/input'
import { toast } from 'sonner'
import { FaXTwitter, FaInstagram } from 'react-icons/fa6'

const pollOptions = [
    'Twitter',
    'Instagram',
    'Friend recommendation',
    'TikTok',
    'Other',
]

export default function DashboardPage() {
    const [user, setUser] = useState<any>(null)
    const [loading, setLoading] = useState(true)
    const [pollLoading, setPollLoading] = useState(true)

    const [response, setResponse] = useState('')
    const [otherText, setOtherText] = useState('')
    const [submitted, setSubmitted] = useState(false)

    const [votes, setVotes] = useState<{ [option: string]: number }>({})
    const [totalVotes, setTotalVotes] = useState(0)

    const router = useRouter()

    useEffect(() => {
        const getUser = async () => {
            const { data } = await supabase.auth.getUser()
            if (!data.user) {
                router.push('/login')
            } else {
                setUser(data.user)
                checkIfVoted(data.user.id)
            }
            setLoading(false)
        }

        const checkIfVoted = async (uid: string) => {
            const { data } = await supabase
                .from('poll_responses')
                .select('id')
                .eq('user_id', uid)
                .maybeSingle()

            if (data) {
                setSubmitted(true)
                await fetchPollResults()
            }

            setPollLoading(false)
        }

        getUser()
    }, [router])

    const handlePollSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!user) return

        const answer = response === 'Other' ? otherText : response

        if (!answer || (response === 'Other' && otherText.trim().length < 2)) {
            toast.error('Please complete the poll before submitting.')
            return
        }

        const { error } = await supabase.from('poll_responses').insert({
            user_id: user.id,
            response: answer,
        })

        if (error) {
            toast.error(error.message || 'You may have already voted.')
        } else {
            toast.success('Thanks for your feedback!')
            setSubmitted(true)
            fetchPollResults()
        }
    }

    const fetchPollResults = async () => {
        const { data, error } = await supabase.from('poll_responses').select('response')
        if (error || !data) return

        const counts: { [option: string]: number } = {}
        for (const option of pollOptions) counts[option] = 0

        for (const vote of data) {
            const key = pollOptions.includes(vote.response) ? vote.response : 'Other'
            counts[key] = (counts[key] || 0) + 1
        }

        const total = Object.values(counts).reduce((sum, n) => sum + n, 0)
        setVotes(counts)
        setTotalVotes(total)
    }

    return (
        <>
            <Navbar />
            <main className="max-w-2xl mx-auto p-6">
                {loading ? (
                    <div className="space-y-4">
                        <Skeleton className="w-24 h-24 rounded-full mx-auto" />
                        <Skeleton className="w-48 h-6 mx-auto" />
                        <Skeleton className="w-64 h-4 mx-auto" />
                    </div>
                ) : (
                    <>
                        {/* User Info */}
                        <Card className="text-center p-6 dark:bg-zinc-800">
                            <CardContent className="space-y-4">
                                <img
                                    src={user.user_metadata?.avatar_url || '/placeholder-avatar.png'}
                                    alt="Avatar"
                                    className="w-24 h-24 rounded-full mx-auto"
                                />
                                <h2 className="text-xl font-bold">
                                    {user.user_metadata?.full_name || 'User'}
                                </h2>
                                <p className="text-muted-foreground">{user.email}</p>
                                <p className="mt-4">Welcome to your dashboard 👋</p>
                            </CardContent>
                        </Card>

                        {/* Poll */}
                        <div className="max-w-lg mx-auto mt-10">
                            <Card className="dark:bg-zinc-800">
                                <CardContent className="p-10 space-y-6">
                                    <h3 className="text-lg font-semibold text-center">
                                        How did you hear about Flint?
                                    </h3>

                                    {pollLoading ? (
                                        <Skeleton className="w-full h-24 rounded" />
                                    ) : submitted ? (
                                        <div className="space-y-4 text-left">
                                            {pollOptions.map((opt) => {
                                                const count = votes[opt] || 0
                                                const percent =
                                                    totalVotes > 0 ? Math.round((count / totalVotes) * 100) : 0

                                                return (
                                                    <div key={opt}>
                                                        <div className="flex justify-between items-center mb-1">
                                                            <span className="text-sm">{opt}</span>
                                                            <span className="text-sm text-muted-foreground">{percent}%</span>
                                                        </div>
                                                        <div className="w-full bg-gray-200 dark:bg-zinc-700 h-2 rounded">
                                                            <div
                                                                className="h-2 rounded bg-black dark:bg-white transition-all duration-500"
                                                                style={{ width: `${percent}%` }}
                                                            />
                                                        </div>
                                                    </div>
                                                )
                                            })}
                                        </div>
                                    ) : (
                                        <form onSubmit={handlePollSubmit} className="space-y-4">
                                            <div className="space-y-3">
                                                {pollOptions.map((opt) => (
                                                    <div key={opt} className="space-y-1">
                                                        <label
                                                            htmlFor={`poll-${opt}`}
                                                            className={`flex items-center gap-3 px-4 py-2 border rounded-lg cursor-pointer transition-all ${
                                                                response === opt
                                                                    ? 'border-black bg-muted font-medium scale-[1.02] dark:border-white'
                                                                    : 'border-gray-300 hover:border-black dark:border-zinc-600 dark:hover:border-white'
                                                            }`}
                                                        >
                                                            <input
                                                                id={`poll-${opt}`}
                                                                type="radio"
                                                                name="poll"
                                                                value={opt}
                                                                checked={response === opt}
                                                                onChange={(e) => {
                                                                    setResponse(e.target.value)
                                                                    if (e.target.value !== 'Other') setOtherText('')
                                                                }}
                                                                className="accent-black dark:accent-white"
                                                            />
                                                            <span>{opt}</span>
                                                        </label>

                                                        {response === 'Other' && opt === 'Other' && (
                                                            <div className="mt-2">
                                                                <Input
                                                                    className="w-full"
                                                                    placeholder="Tell us where you heard about Flint"
                                                                    value={otherText}
                                                                    onChange={(e) => setOtherText(e.target.value)}
                                                                    required
                                                                />
                                                            </div>
                                                        )}
                                                    </div>
                                                ))}
                                            </div>

                                            <button
                                                type="submit"
                                                className="w-full bg-black dark:bg-white text-white dark:text-black rounded-xl py-2 text-sm hover:opacity-90 transition"
                                            >
                                                Submit
                                            </button>
                                        </form>
                                    )}
                                </CardContent>
                            </Card>
                        </div>

                        {/* Socials */}
                        <section className="mt-10 text-center space-y-2">
                            <h3 className="text-lg font-semibold">Follow Flint</h3>
                            <div className="flex justify-center gap-4">
                                <a
                                    href="https://twitter.com/flintpowerd"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="bg-black hover:bg-gray-600 text-white px-4 py-2 rounded-xl text-sm flex items-center gap-2 transition"
                                >
                                    <FaXTwitter className="w-4 h-4" />
                                    X/Twitter
                                </a>
                                <a
                                    href="https://instagram.com/flintfuel"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 hover:opacity-90 text-white px-4 py-2 rounded-xl text-sm flex items-center gap-2 transition"
                                >
                                    <FaInstagram className="w-4 h-4" />
                                    Instagram
                                </a>
                            </div>
                        </section>
                    </>
                )}
            </main>
        </>
    )
}
