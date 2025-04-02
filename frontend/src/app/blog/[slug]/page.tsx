import { getBlogPost } from "@/lib/blog";
import Navbar from '@/components/Navbar'
import Link from 'next/link'
import {FiArrowLeft} from "react-icons/fi";

export default async function BlogPostPage({ params }: { params: { slug: string } }) {
    const post = await getBlogPost(params.slug)

    if (!post) return null

    return (
        <>
            <Navbar />
            <main className="px-4 sm:px-6 lg:px-8 py-16">
                <Link href="/blog" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition mb-4">
                    <FiArrowLeft className="w-4 h-4" />
                    Back to Blog
                </Link>
                <article className="prose dark:prose-invert max-w-3xl mx-auto">
                    <h1>{post.title}</h1>
                    <p className="text-muted-foreground text-sm">{new Date(post.date).toDateString()}</p>
                    <div className="mt-8" dangerouslySetInnerHTML={{ __html: post.contentHtml }} />
                </article>
            </main>
        </>
    )
}
