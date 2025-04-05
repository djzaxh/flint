'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import Navbar from '@/components/Navbar'
import AnimatedBackground from '@/components/AnimateBackground'
import WaitlistForm from '@/components/WaitlistForm'
import { FaRobot, FaChartPie, FaUtensils, FaMagic, FaBrain, FaCamera, FaBolt } from 'react-icons/fa'

export default function LandingPage() {
    return (
        <div className="relative h-full w-full overflow-hidden">
            <AnimatedBackground />
            <Navbar showLogin />

            <main className="relative z-10 text-foreground px-6 pt-24">
                {/* Hero */}
                <section className="max-w-4xl mx-auto text-center py-24 space-y-6">
                    <h1 className="text-5xl font-bold tracking-tight">Fuel smarter. Live better.</h1>
                    <p className="text-lg text-muted-foreground">
                        Get Strong is your AI-powered health companion. Flint, your personal assistant, learns how you eat and move—then guides you toward better choices, even when you're eating out.
                    </p>
                    <Button asChild size="lg" className="text-lg px-8 py-6">
                        <Link href="/login">Start Free</Link>
                    </Button>
                </section>

                {/* Features */}
                <section className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto py-16">
                    {[{
                        icon: <FaRobot className="text-2xl" />,
                        title: 'Meet Flint',
                        desc: `Your AI health assistant. Ask what to eat, when to eat it, or how to reach your goals. Flint’s got your back.`,
                    }, {
                        icon: <FaChartPie className="text-2xl" />,
                        title: 'Macro tracking made effortless',
                        desc: `Just tell Flint what you ate. He’ll figure out the macros, adjust your targets, and log it all for you.`,
                    }, {
                        icon: <FaUtensils className="text-2xl" />,
                        title: 'Smarter choices at restaurants',
                        desc: `Going out? Flint helps you choose the best dishes from DoorDash, Uber Eats, and local menus based on your goals.`,
                    }, {
                        icon: <FaMagic className="text-2xl" />,
                        title: 'Personalized to your taste',
                        desc: `Flint adapts to your flavor preferences, lifestyle, and schedule—making healthy eating automatic.`,
                    }].map((item, idx) => (
                        <div key={idx} className="bg-muted/30 rounded-xl p-6 backdrop-blur-xl space-y-2 hover:scale-[1.01] transition">
                            {item.icon}
                            <h3 className="text-xl font-semibold">{item.title}</h3>
                            <p className="text-muted-foreground">{item.desc}</p>
                        </div>
                    ))}
                </section>

                {/* How It Works */}
                <section className="py-24 max-w-6xl mx-auto px-6 space-y-16">
                    <h2 className="text-3xl font-bold text-center">How Get Strong Works</h2>
                    <div className="grid md:grid-cols-3 gap-10 text-center">

                        {/* Step 1 */}
                        <div className="space-y-4">
                            <FaBrain className="text-5xl text-primary mx-auto" />
                            <h3 className="text-xl font-semibold">Take the Taste Quiz</h3>
                            <p className="text-muted-foreground">
                                Flint learns your goals, habits, and food preferences in under 2 minutes.
                            </p>
                        </div>

                        {/* Step 2 */}
                        <div className="space-y-4">
                            <FaCamera className="text-5xl text-primary mx-auto" />
                            <h3 className="text-xl font-semibold">Log Meals or Snap Pics</h3>
                            <p className="text-muted-foreground">
                                Just describe what you ate or upload a photo. Flint handles the macros.
                            </p>
                        </div>

                        {/* Step 3 */}
                        <div className="space-y-4">
                            <FaBolt className="text-5xl text-primary mx-auto" />
                            <h3 className="text-xl font-semibold">Get Personalized Suggestions</h3>
                            <p className="text-muted-foreground">
                                Flint gives you real-time guidance—even at restaurants.
                            </p>
                        </div>

                    </div>
                </section>

                {/* Why Get Strong */}
                <section className="py-32 max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">
                    <div className="space-y-6">
                        <h2 className="text-3xl font-bold">Why Get Strong?</h2>
                        <p className="text-muted-foreground text-lg">
                            Flint adapts to your life. He doesn’t just track — he thinks, recommends, and supports.
                        </p>
                        <ul className="space-y-4 text-left list-disc list-inside text-muted-foreground">
                            <li>⚙️ Context-aware food logging</li>
                            <li>📍 Restaurant menu scanning</li>
                            <li>📊 Macro coaching for any goal</li>
                            <li>🤖 An AI that actually listens</li>
                        </ul>
                    </div>
                    <div className="rounded-2xl bg-gradient-to-br from-zinc-200/40 to-transparent dark:from-zinc-700/30 backdrop-blur-xl p-12 shadow-xl">
                        <p className="text-lg text-zinc-900 dark:text-white font-semibold">
                            "I’m not here to judge. I’m here to get you results — one meal at a time." <br />
                            <span className="block text-sm text-muted-foreground mt-2">— Flint, your AI nutrition agent</span>
                        </p>
                    </div>
                </section>

                {/* Waitlist */}
                <section className="py-24 max-w-3xl mx-auto text-center px-6 space-y-10">
                    <div className="bg-muted/30 backdrop-blur-xl border border-border rounded-xl p-10">
                        <h2 className="text-3xl font-bold">Join the waitlist</h2>
                        <p className="text-muted-foreground mb-6 p-6">
                            Be the first to try Get Strong when we launch. Flint's excited to meet you.
                        </p>
                        <WaitlistForm />
                    </div>
                </section>

                {/* Footer */}
                <footer className="text-center text-muted-foreground text-sm mt-20 py-10">
                    © {new Date().getFullYear()} Get Strong. Built with 💪
                </footer>
            </main>
        </div>
    )
}
