import { writeFile } from "fs/promises";
import { join } from "path";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const formData = await req.formData();
  const file = formData.get("file") as File;

  if (!file || !file.name.endsWith(".md")) {
    return NextResponse.json(
      { error: "Please upload a valid .md file." },
      { status: 400 }
    );
  }

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  const filePath = join(process.cwd(), "content", "blog", file.name);

  try {
    await writeFile(filePath, buffer);
    return NextResponse.json({
      success: true,
      slug: file.name.replace(".md", ""),
    });
  } catch (err) {
    return NextResponse.json(
      { error: "Failed to save file." },
      { status: 500 }
    );
  }
}
