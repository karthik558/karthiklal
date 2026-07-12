import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";

// Helper to get the absolute path to a JSON file
const getFilePath = (model: string) => {
  return path.join(process.cwd(), "public", "data", `${model}.json`);
};

export async function GET(
  request: Request,
  { params }: { params: Promise<{ model: string }> }
) {
  try {
    const { model } = await params;
    const filePath = getFilePath(model);
    const fileContents = await fs.readFile(filePath, "utf8");
    const data = JSON.parse(fileContents);
    return NextResponse.json(data);
  } catch (error) {
    console.error(`Error reading params.model.json:`, error);
    return NextResponse.json(
      { error: "File not found or unreadable" },
      { status: 404 }
    );
  }
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ model: string }> }
) {
  try {
    const { model } = await params;
    const data = await request.json();
    const filePath = getFilePath(model);
    
    // Ensure the data is pretty-printed when saving
    const fileContents = JSON.stringify(data, null, 2);
    
    await fs.writeFile(filePath, fileContents, "utf8");
    return NextResponse.json({ success: true, message: "Saved successfully" });
  } catch (error) {
    console.error(`Error writing params.model.json:`, error);
    return NextResponse.json(
      { error: "Failed to save file" },
      { status: 500 }
    );
  }
}

