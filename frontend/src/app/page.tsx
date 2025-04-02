'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import Navbar from '@/components/Navbar'
import { FaRobot, FaChartPie, FaUtensils, FaMagic } from 'react-icons/fa'
import AnimatedBackground from "@/components/AnimateBackground";
import WaitlistForm from "@/components/WaitlistForm";

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
                        Flint is your AI-powered health assistant. It learns how you eat, how you move, and guides you to better choices — even at restaurants.
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
                            <h3 className="text-xl font-semibold">AI health assistant</h3>
                            <p className="text-muted-foreground">
                                Chat with Flint and ask what to eat, when to eat it, or how to meet your goals.
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-6 space-y-2">
                            <FaChartPie className="text-2xl" />
                            <h3 className="text-xl font-semibold">Macro tracking made easy</h3>
                            <p className="text-muted-foreground">
                                Just tell Flint what you ate. It'll handle the logging, portioning, and goals.
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-6 space-y-2">
                            <FaUtensils className="text-2xl" />
                            <h3 className="text-xl font-semibold">Smarter restaurant decisions</h3>
                            <p className="text-muted-foreground">
                                Flint analyzes restaurant menus and recommends options based on your profile.
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-6 space-y-2">
                            <FaMagic className="text-2xl" />
                            <h3 className="text-xl font-semibold">Learns your taste</h3>
                            <p className="text-muted-foreground">
                                From quiz to daily behavior, Flint tailors suggestions to what you love.
                            </p>
                        </CardContent>
                    </Card>
                </section>

                {/* Waitlist */}
                <section className="py-24 bg-muted/30 backdrop-blur-xl rounded-xl max-w-3xl mx-auto text-center px-6">
                    <h2 className="text-3xl font-bold mb-4">Join the waitlist</h2>
                    <p className="text-muted-foreground mb-6">
                        Be the first to try Flint when we launch.
                    </p>
                    <WaitlistForm />
                </section>

                {/* Footer */}
                <footer className="text-center text-muted-foreground text-sm mt-20 py-10">
                    © {new Date().getFullYear()} Flint. Built with ❤️
                </footer>
            </main>
        </div>
    )
}
