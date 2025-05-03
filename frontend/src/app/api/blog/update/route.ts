import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const blogDirectory = path.join(process.cwd(), "src/content/blog");

export async function PUT(request: NextRequest) {
  try {
    const { filename, content } = await request.json();

    if (!filename || !content) {
      return NextResponse.json(
        { error: "Filename and content are required" },
        { status: 400 }
      );
    }

    // Ensure the file exists and is within the blog directory
    const filePath = path.join(blogDirectory, filename);
    if (!fs.existsSync(filePath) || !filePath.startsWith(blogDirectory)) {
      return NextResponse.json(
        { error: "File not found or invalid path" },
        { status: 404 }
      );
    }

    // Write the updated content to the file
    fs.writeFileSync(filePath, content);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error updating blog post:", error);
    return NextResponse.json(
      { error: "Failed to update blog post" },
      { status: 500 }
    );
  }
}
