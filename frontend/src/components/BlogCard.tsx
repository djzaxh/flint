// /components/BlogCard.tsx
import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'

type BlogPost = {
  title: string
  excerpt: string
  slug: string
}

export default function BlogCard({ post }: { post: BlogPost }) {
  return (
    <Card>
      <CardContent className="p-6 space-y-2">
        <h2 className="text-2xl font-semibold">{post.title}</h2>
        <p className="text-muted-foreground">{post.excerpt}</p>
        <Link
          href={`/blog/${post.slug}`}
          className="text-sm text-primary hover:underline"
        >
          Read more →
        </Link>
      </CardContent>
    </Card>
  )
}

