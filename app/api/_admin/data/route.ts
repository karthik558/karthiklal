import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";

export async function GET() {
  try {
    const dataDir = path.join(process.cwd(), "public", "data");
    const files = await fs.readdir(dataDir);
    const models = files
      .filter(f => f.endsWith('.json'))
      .map(f => f.replace('.json', ''));
    
    return NextResponse.json(models);
  } catch (error) {
    console.error("Error reading data directory:", error);
    return NextResponse.json(
      { error: "Failed to read data directory" },
      { status: 500 }
    );
  }
}
