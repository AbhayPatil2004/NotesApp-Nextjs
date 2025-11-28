import { NextResponse } from "next/server";
import dbConnect from "@/dbConnect/db";
import Image from "@/models/imageModel";

export async function GET() {
  try {
    await dbConnect();
    console.log("Database connected");

    const data = await Image.find().lean(); // works fine in JS

    if (!data || data.length === 0) {
      return NextResponse.json({ ok: true, message: "No images found", images: [] });
    }

    return NextResponse.json({ ok: true, message: "Images fetched successfully", images: data });
  } catch (error) {
    console.error("GET /api/fetchImages error:", error);
    return NextResponse.json({ ok: false, message: `Error fetching images: ${error?.message || error}` }, { status: 500 });
  }
}
