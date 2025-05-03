import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import matter from "gray-matter";

const blogDirectory = path.join(process.cwd(), "src/content/blog");

export async function GET() {
  try {
    // Get all blog post files
    const filenames = fs.readdirSync(blogDirectory);

    // Process each file to extract metadata and content
    const posts = filenames
      .map((filename) => {
        const slug = filename.replace(/\.md$/, "");
        const filePath = path.join(blogDirectory, filename);
        const fileContents = fs.readFileSync(filePath, "utf8");

        // Parse frontmatter and content
        const { data, content } = matter(fileContents);

        return {
          slug,
          title: data.title,
          excerpt: data.excerpt,
          date: data.date,
          content,
          filename,
        };
      })
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()); // newest first

    return NextResponse.json({ posts });
  } catch (error) {
    console.error("Error fetching blog posts:", error);
    return NextResponse.json(
      { error: "Failed to fetch blog posts" },
      { status: 500 }
    );
  }
}
