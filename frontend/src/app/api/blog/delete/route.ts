import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const blogDirectory = path.join(process.cwd(), "src/content/blog");

export async function DELETE(request: NextRequest) {
  try {
    const { filename } = await request.json();

    if (!filename) {
      return NextResponse.json(
        { error: "Filename is required" },
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

    // Delete the file
    fs.unlinkSync(filePath);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting blog post:", error);
    return NextResponse.json(
      { error: "Failed to delete blog post" },
      { status: 500 }
    );
  }
}
