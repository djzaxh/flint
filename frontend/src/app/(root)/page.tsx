"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import AnimatedBackground from "@/components/AnimateBackground";
import WaitlistForm from "@/components/WaitlistForm";
import { scrollToElement } from "@/lib/utils";
import { FaMagic } from "react-icons/fa";
import {
  FaRobot,
  FaChartPie,
  FaUtensils,
  FaBrain,
  FaBowlFood,
  FaBolt,
  FaArrowRight,
} from "react-icons/fa6";

export default function LandingPage() {
  const handleScroll = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    scrollToElement(id);
  };

  return (
    <div className="relative h-full w-full overflow-hidden">
      <AnimatedBackground />
      <Navbar showLogin />

      <main className="relative z-10 text-foreground px-6 pt-24">
        {/* Hero */}
        <section className="max-w-4xl mx-auto text-center py-24 space-y-6">
          <h1 className="text-5xl font-bold tracking-tight">
            Eating healthy just got easier.
          </h1>
          <p className="text-lg text-muted-foreground">
            Get Strong is for busy people who want better eating habits. Flint,
            your AI nutritionist, takes the stress out of tracking food and
            choosing meals—so you stay on track, even when life gets hectic.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="text-lg px-8 py-6">
              <Link href="/signup">Get Started Free</Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="text-lg px-8 py-6"
            >
              <a
                href="#how-it-works"
                onClick={(e) => handleScroll(e, "how-it-works")}
              >
                See How It Works
              </a>
            </Button>
          </div>
        </section>

        {/* Features */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto py-16">
          {[
            {
              icon: <FaRobot className="text-2xl" />,
              title: "Flint understands your struggle",
              desc: `We know tracking meals is frustrating and hard to stick with. Flint is here to guide you, not judge you.`,
            },
            {
              icon: <FaChartPie className="text-2xl" />,
              title: "Smarter tracking, no logging",
              desc: `Just tell Flint what you ate. He'll handle the macros and keep you on track—effortlessly.`,
            },
            {
              icon: <FaUtensils className="text-2xl" />,
              title: "Confident choices when dining out",
              desc: `Flint recommends the best dishes from DoorDash, Uber Eats, or nearby spots to match your goals.`,
            },
            {
              icon: <FaMagic className="text-2xl" />,
              title: "Nutrition that fits your life",
              desc: `Flint adapts to your taste, habits, and schedule. You get a plan made just for you—with no stress.`,
            },
          ].map((item, idx) => (
            <div
              key={idx}
              className="bg-muted/30 rounded-xl p-6 backdrop-blur-xl space-y-2 hover:scale-[1.01] transition"
            >
              {item.icon}
              <h3 className="text-xl font-semibold">{item.title}</h3>
              <p className="text-muted-foreground">{item.desc}</p>
            </div>
          ))}
        </section>
        <div className="text-center">
          <Button asChild size="lg" variant="outline">
            <Link href="/signup" className="flex items-center gap-2">
              Try Flint Now <FaArrowRight />
            </Link>
          </Button>
        </div>

        {/* How It Works */}
        <section
          id="how-it-works"
          className="scroll-mt-16 py-24 max-w-6xl mx-auto px-6 space-y-16"
        >
          <h2 className="text-3xl font-bold text-center">
            A Simple Plan for Healthier Eating
          </h2>
          <div className="grid md:grid-cols-3 gap-10 text-center">
            <div className="space-y-4">
              <FaBrain className="text-5xl text-primary mx-auto" />
              <h3 className="text-xl font-semibold">Tell Flint about you</h3>
              <p className="text-muted-foreground">
                Answer a few quick questions about your goals, preferences, and
                habits.
              </p>
            </div>
            <div className="space-y-4">
              <FaBowlFood className="text-5xl text-primary mx-auto" />
              <h3 className="text-xl font-semibold text-center">
                Share what you ate
              </h3>
              <p className="text-muted-foreground text-center">
                Describe your meal in plain language. Flint handles the rest.
              </p>
            </div>
            <div className="space-y-4">
              <FaBolt className="text-5xl text-primary mx-auto" />
              <h3 className="text-xl font-semibold">
                Get real-time suggestions
              </h3>
              <p className="text-muted-foreground">
                Flint helps you stay on track—at home or while eating out.
              </p>
            </div>
          </div>
          <div className="text-center pt-8">
            <Button asChild size="lg">
              <Link href="/signup" className="flex items-center gap-2">
                Start Your Journey <FaArrowRight />
              </Link>
            </Button>
          </div>
        </section>

        {/* Why Get Strong */}
        <section className="py-32 max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h2 className="text-3xl font-bold">
              Your path to progress starts here
            </h2>
            <p className="text-muted-foreground text-lg">
              No more guilt. No more guesswork. Flint helps you eat well without
              giving up your lifestyle.
            </p>
            <ul className="space-y-4 text-left list-disc list-inside text-muted-foreground">
              <li>⚙️ Understands your goals and tastes</li>
              <li>📍 Makes dining out easy</li>
              <li>📊 Automatically adjusts your macros</li>
              <li>🤖 Keeps you motivated and in control</li>
            </ul>
            <div className="pt-4">
              <Button asChild>
                <Link href="/signup">Get Started Today</Link>
              </Button>
            </div>
          </div>
          <div className="rounded-2xl bg-gradient-to-br from-zinc-200/40 to-transparent dark:from-zinc-700/30 backdrop-blur-xl p-12 shadow-xl">
            <p className="text-lg text-zinc-900 dark:text-white font-semibold">
              "Struggling with food choices? I'm here to simplify things—one
              bite at a time."
              <br />
              <span className="block text-sm text-muted-foreground mt-2">
                — Flint, your AI nutritionist
              </span>
            </p>
          </div>
        </section>

        {/* Waitlist */}
        <section className="py-24 max-w-3xl mx-auto text-center px-6 space-y-10">
          <div className="bg-muted/30 backdrop-blur-xl border border-border rounded-xl p-10">
            <h2 className="text-3xl font-bold">Take the first step</h2>
            <p className="text-muted-foreground mb-6 p-6">
              Get early access to Flint and enjoy stress-free, smarter eating.
              Start your journey from overwhelmed to empowered.
            </p>
            <div className="space-y-6">
              <WaitlistForm />
              <div className="flex justify-center gap-4">
                <Button asChild variant="outline">
                  <Link href="/login">Already have an account?</Link>
                </Button>
              </div>
            </div>
            <figcaption className="text-muted-foreground text-sm mt-6">
              Be sure to check your junk folder.
            </figcaption>
          </div>
        </section>

        {/* Footer */}
        <footer className="text-center text-muted-foreground text-sm mt-20 py-10">
          © {new Date().getFullYear()} Get Strong. Built with 💪
        </footer>
      </main>
    </div>
  );
}
