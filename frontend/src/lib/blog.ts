import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { remark } from 'remark'
import html from 'remark-html'
import remarkGfm from 'remark-gfm'

const blogDirectory = path.join(process.cwd(), 'src/content/blog')

// Get all posts metadata
export function getAllPosts() {
    const filenames = fs.readdirSync(blogDirectory)

    return filenames.map((filename) => {
        const slug = filename.replace(/\.md$/, '')
        const filePath = path.join(blogDirectory, filename)
        const fileContents = fs.readFileSync(filePath, 'utf8')

        const { data } = matter(fileContents)

        return {
            slug,
            title: data.title,
            excerpt: data.excerpt,
            date: data.date,
        }
    }).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()) // newest first
}

// Get a single post's HTML + metadata
export async function getBlogPost(slug: string) {
    const fullPath = path.join(blogDirectory, `${slug}.md`)
    const fileContents = fs.readFileSync(fullPath, 'utf8')

    const { data, content } = matter(fileContents)
    const processedContent = await remark()
        .use(remarkGfm) // Adds support for GitHub Flavored Markdown
        .use(html, { sanitize: false }) // Don't sanitize to allow all HTML elements
        .process(content)
    const contentHtml = processedContent.toString()

    return {
        slug,
        title: data.title,
        date: data.date,
        contentHtml,
    }
}