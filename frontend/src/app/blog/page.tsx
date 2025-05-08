import { getAllPosts } from "@/lib/blog";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import { Card, CardContent } from "@/components/ui/card";
import Script from "next/script";

export const dynamic = "force-static";

// JSON-LD structured data for blog listing
function BlogListingJsonLd({ posts }: { posts: any[] }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Blog",
    "name": "GetStrong Blog",
    "description": "Updates, insights, and health wisdom—straight from GetStrong.",
    "url": "https://getstrong.ai/blog",
    "publisher": {
      "@type": "Organization",
      "name": "GetStrong",
      "logo": {
        "@type": "ImageObject",
        "url": "https://getstrong.ai/logo.png"
      }
    },
    "blogPosts": posts.map(post => ({
      "@type": "BlogPosting",
      "headline": post.title,
      "description": post.excerpt,
      "datePublished": new Date(post.date).toISOString(),
      "url": `https://getstrong.ai/blog/${post.slug}`
    }))
  };

  return (
    <Script
      id="blog-listing-jsonld"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

// Breadcrumb JSON-LD
function BreadcrumbJsonLd() {
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
      }
    ]
  };

  return (
    <Script
      id="breadcrumb-jsonld"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

export default function BlogPage() {
  const posts = getAllPosts();

  return (
    <>
      <BlogListingJsonLd posts={posts} />
      <BreadcrumbJsonLd />
      <Navbar showLogin />
      <main className="max-w-3xl mx-auto px-6 py-16 space-y-8">
        <h1 className="text-4xl font-bold text-center">The Get Strong Blog</h1>
        <p className="text-muted-foreground text-center max-w-lg mx-auto">
          Updates, insights, and health wisdom—straight from Flint.
        </p>

        <div className="space-y-6">
          {posts.map((post) => (
            <Card key={post.slug}>
              <CardContent className="p-6 space-y-2">
                <h2 className="text-2xl font-semibold">{post.title}</h2>
                <hr className="my-4 h-0.5 border-0 bg-gray-200 dark:bg-gray-700 rounded-full" />{" "}
                <p className="text-muted-foreground">{post.excerpt}</p>
                <Link
                  href={`/blog/${post.slug}`}
                  className="text-sm text-primary hover:underline"
                >
                  Read more →
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
    </>
  );
}
