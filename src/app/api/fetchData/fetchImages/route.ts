// app/api/fetchImages/route.ts
import { NextResponse } from "next/server";
import dbConnect from "@/dbConnect/db";
import Image from "../../../../models/imageModel";

export async function GET() {
  try {
    await dbConnect();
    console.log("Database connected");

    const data = await Image.find().lean(); // .lean() returns plain objects

    if (!data || data.length === 0) {
      return NextResponse.json(
        { ok: true, message: "No images found", images: [] },
        { status: 200 }
      );
    }

    return NextResponse.json(
      { ok: true, message: "Images fetched successfully", images: data },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("GET /api/fetchImages error:", error);
    return NextResponse.json(
      { ok: false, message: `Error fetching images: ${error?.message || error}` },
      { status: 500 }
    );
  }
}
