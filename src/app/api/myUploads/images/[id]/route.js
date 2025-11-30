import { NextResponse } from "next/server";
import Image from "@/models/imageModel";
import User from "@/models/User.Model";
import dbConnect from "@/dbConnect/db";

export async function GET(request, { params }) {
  try {
    const usernameParam = params?.userName || params?.id;
    if (!usernameParam) {
      return NextResponse.json({ ok: false, message: "Missing route parameter: userName" }, { status: 400 });
    }

    const userName = decodeURIComponent(String(usernameParam));

    await dbConnect();

    const user = await User.findOne({ userName }).lean();
    if (!user) {
      return NextResponse.json({ ok: false, message: `User not found: ${userName}` }, { status: 404 });
    }

    const images = await Image.find({ uploadedBy: userName }).sort({ createdAt: -1 }).lean();

    return NextResponse.json(
      {
        ok: true,
        message: images.length ? "Images fetched" : "No images found",
        body: images,
        count: images.length,
      },
      { status: 200 }
    );
  } catch (err) {
    console.error("GET error:", err);
    return NextResponse.json({ ok: false, message: "Internal server error" }, { status: 500 });
  }
}
