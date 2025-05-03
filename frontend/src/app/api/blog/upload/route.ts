import { NextRequest, NextResponse } from "next/server";
import { writeFile } from "fs/promises";
import { join } from "path";

// This is a simplified version that doesn't check authentication
// In a production environment, you should implement proper authentication
export async function POST(request: NextRequest) {
  try {
    // Get the file from the request
    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Check if the file is a markdown file
    if (!file.name.endsWith(".md")) {
      return NextResponse.json(
        { error: "Only markdown files are allowed" },
        { status: 400 }
      );
    }

    // Read the file content
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const content = buffer.toString("utf-8");

    // Generate a slug from the filename
    const slug = file.name
      .replace(".md", "")
      .toLowerCase()
      .replace(/\s+/g, "-");

    // Save the file to the content/blog directory
    const filePath = join(
      process.cwd(),
      "src",
      "content",
      "blog",
      `${slug}.md`
    );
    await writeFile(filePath, content);

    return NextResponse.json({ success: true, slug });
  } catch (error) {
    console.error("Error uploading file:", error);
    return NextResponse.json(
      { error: "Failed to upload file" },
      { status: 500 }
    );
  }
}
