// /src/app/blog/page.tsx
import { getAllPosts } from "@/lib/blog";
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import { Card, CardContent } from '@/components/ui/card'

export const dynamic = 'force-static' // Optional: force static rendering

export default function BlogPage() {
    const posts = getAllPosts()

    return (
        <>
            <Navbar showLogin />
            <main className="max-w-3xl mx-auto px-6 py-16 space-y-8">
                <h1 className="text-4xl font-bold text-center">Flint Blog</h1>
                <p className="text-muted-foreground text-center max-w-lg mx-auto">
                    Insights, updates, and stories from the Flint team.
                </p>

                <div className="space-y-6">
                    {posts.map((post) => (
                        <Card key={post.slug}>
                            <CardContent className="p-6 space-y-2">
                                <h2 className="text-2xl font-semibold">{post.title}</h2>
                                <p className="text-muted-foreground">{post.excerpt}</p>
                                <Link href={`/blog/${post.slug}`} className="text-sm text-primary hover:underline">
                                    Read more →
                                </Link>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </main>
        </>
    )
}
