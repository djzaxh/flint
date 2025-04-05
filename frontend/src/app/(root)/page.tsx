'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import Navbar from '@/components/Navbar'
import { FaRobot, FaChartPie, FaUtensils, FaMagic } from 'react-icons/fa'
import AnimatedBackground from '@/components/AnimateBackground'
import WaitlistForm from '@/components/WaitlistForm'

export default function LandingPage() {
    return (
        <div className="relative h-full w-full overflow-hidden">
            <AnimatedBackground />
            <Navbar showLogin />

            <main className="relative z-10 text-foreground px-6 pt-24">
                {/* Hero Section */}
                <section className="max-w-4xl mx-auto text-center py-24 space-y-6">
                    <h1 className="text-5xl font-bold tracking-tight">
                        Fuel smarter. Live better.
                    </h1>
                    <p className="text-lg text-muted-foreground">
                        Get Strong is your AI-powered health companion. Flint, your personal
                        assistant, learns how you eat and move—then guides you toward better
                        choices, even when you're eating out.
                    </p>
                    <Button asChild size="lg" className="text-lg px-8 py-6">
                        <Link href="/login">Start Free</Link>
                    </Button>
                </section>

                {/* Features */}
                <section className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto py-16">
                    <Card>
                        <CardContent className="p-6 space-y-2">
                            <FaRobot className="text-2xl" />
                            <h3 className="text-xl font-semibold">Meet Flint</h3>
                            <p className="text-muted-foreground">
                                Your AI health assistant. Ask what to eat, when to eat it, or how
                                to reach your goals. Flint’s got your back.
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-6 space-y-2">
                            <FaChartPie className="text-2xl" />
                            <h3 className="text-xl font-semibold">Macro tracking made effortless</h3>
                            <p className="text-muted-foreground">
                                Just tell Flint what you ate. He’ll figure out the macros, adjust
                                your targets, and log it all for you.
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-6 space-y-2">
                            <FaUtensils className="text-2xl" />
                            <h3 className="text-xl font-semibold">Smarter choices at restaurants</h3>
                            <p className="text-muted-foreground">
                                Going out? Flint helps you choose the best dishes from DoorDash,
                                Uber Eats, and local menus based on your goals.
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-6 space-y-2">
                            <FaMagic className="text-2xl" />
                            <h3 className="text-xl font-semibold">Personalized to your taste</h3>
                            <p className="text-muted-foreground">
                                Flint adapts to your flavor preferences, lifestyle, and schedule—
                                making healthy eating automatic.
                            </p>
                        </CardContent>
                    </Card>
                </section>

                {/* Waitlist */}
                <section className="py-24 bg-muted/30 backdrop-blur-xl rounded-xl max-w-3xl mx-auto text-center px-6">
                    <h2 className="text-3xl font-bold mb-4">Join the waitlist</h2>
                    <p className="text-muted-foreground mb-6">
                        Be the first to try Get Strong when we launch. Flint's excited to meet you.
                    </p>
                    <WaitlistForm />
                </section>

                {/* Footer */}
                <footer className="text-center text-muted-foreground text-sm mt-20 py-10">
                    © {new Date().getFullYear()} Get Strong. Built with 💪
                </footer>
            </main>
        </div>
    )
}
