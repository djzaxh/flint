import { getBlogPost } from "@/lib/blog";
import Navbar from '@/components/Navbar'
import Link from 'next/link'
import {FiArrowLeft} from "react-icons/fi";
import '../blog.css';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Script from 'next/script';

// Generate metadata for each blog post dynamically
export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
    const post = await getBlogPost(params.slug);
    
    if (!post) {
        return {
            title: 'Post Not Found | GetStrong Blog',
            description: 'The blog post you are looking for could not be found.',
        };
    }

    // Extract a description from the post content
    // This removes HTML tags and truncates to ~160 characters for SEO
    const contentText = post.contentHtml.replace(/<[^>]*>/g, '');
    const description = contentText.length > 160 
        ? `${contentText.substring(0, 157)}...` 
        : contentText;

    return {
        title: `${post.title} | GetStrong Blog`,
        description,
        keywords: [`nutrition`, `health`, `wellness`, `${post.slug}`, `getstrong`],
        authors: [{ name: "GetStrong Team" }],
        openGraph: {
            title: post.title,
            description,
            type: 'article',
            publishedTime: post.date,
            url: `https://getstrong.ai/blog/${post.slug}`,
            images: [
                {
                    url: `/blog-posts/${post.slug}.jpg`,
                    width: 1200,
                    height: 630,
                    alt: post.title,
                },
                {
                    // Fallback image if post-specific one doesn't exist
                    url: '/seo/blog-og-image.jpg',
                    width: 1200,
                    height: 630,
                    alt: 'GetStrong Blog',
                },
            ],
        },
        twitter: {
            card: 'summary_large_image',
            title: post.title,
            description,
            images: [`/blog-posts/${post.slug}.jpg`, '/seo/blog-twitter-image.jpg'],
        },
        alternates: {
            canonical: `/blog/${post.slug}`,
        },
    };
}

// JSON-LD structured data for blog post
function BlogPostJsonLd({ post }: { post: any }) {
    // Format date to ISO string
    const datePublished = new Date(post.date).toISOString();
    
    // Create structured data
    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "BlogPosting",
        "headline": post.title,
        "datePublished": datePublished,
        "dateModified": datePublished,
        "author": {
            "@type": "Organization",
            "name": "GetStrong Team",
            "url": "https://getstrong.ai"
        },
        "publisher": {
            "@type": "Organization",
            "name": "GetStrong",
            "logo": {
                "@type": "ImageObject",
                "url": "https://getstrong.ai/logo.png"
            }
        },
        "mainEntityOfPage": {
            "@type": "WebPage",
            "@id": `https://getstrong.ai/blog/${post.slug}`
        },
        "image": [
            `https://getstrong.ai/blog-posts/${post.slug}.jpg`,
            "https://getstrong.ai/seo/blog-og-image.jpg"
        ],
        "url": `https://getstrong.ai/blog/${post.slug}`
    };
    
    return (
        <Script 
            id="blog-post-jsonld"
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
    );
}

// Breadcrumb JSON-LD for blog post
function BlogPostBreadcrumbJsonLd({ post }: { post: any }) {
    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": [
            {
                "@type": "ListItem",
                "position": 1,
                "name": "Home",
                "item": "https://getstrong.ai"
            },
            {
                "@type": "ListItem",
                "position": 2,
                "name": "Blog",
                "item": "https://getstrong.ai/blog"
            },
            {
                "@type": "ListItem",
                "position": 3,
                "name": post.title,
                "item": `https://getstrong.ai/blog/${post.slug}`
            }
        ]
    };
    
    return (
        <Script 
            id="blog-post-breadcrumb-jsonld"
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
    )
}

export default async function BlogPostPage({ params }: { params: { slug: string } }) {
    const post = await getBlogPost(params.slug)

    if (!post) return notFound()

    return (
        <>
            <BlogPostJsonLd post={post} />
            <BlogPostBreadcrumbJsonLd post={post} />
            <Navbar />
            <main className="px-4 sm:px-6 lg:px-8 py-16">
                {/* Visual breadcrumb navigation */}
                <nav aria-label="Breadcrumb" className="mb-6">
                    <ol className="flex items-center space-x-2 text-sm">
                        <li>
                            <Link href="/" className="text-muted-foreground hover:text-foreground transition">Home</Link>
                        </li>
                        <li className="text-muted-foreground">/</li>
                        <li>
                            <Link href="/blog" className="text-muted-foreground hover:text-foreground transition">Blog</Link>
                        </li>
                        <li className="text-muted-foreground">/</li>
                        <li className="text-foreground font-medium truncate max-w-[200px]" aria-current="page">{post.title}</li>
                    </ol>
                </nav>
                
                <Link href="/blog" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition mb-4">
                    <FiArrowLeft className="w-4 h-4" />
                    Back to Blog
                </Link>
                <article className="prose prose-lg dark:prose-invert prose-headings:font-bold prose-h2:text-2xl prose-h2:mt-10 prose-h2:mb-5 prose-p:text-base prose-p:leading-relaxed prose-li:text-base prose-li:my-1 prose-ul:my-5 prose-ul:space-y-3 max-w-2xl mx-auto px-4 blog-content">
                    <h1>{post.title}</h1>
                    <p className="text-muted-foreground text-sm">{new Date(post.date).toDateString()}</p>
                    <div className="mt-8 space-y-6" dangerouslySetInnerHTML={{ __html: post.contentHtml }} />
                </article>
            </main>
        </>
    )
}
