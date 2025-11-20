// app/api/textcode/route.ts
import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import dbConnect from "@/dbConnect/db";
import TextCode from "../../../../models/text-code-Model";

export const runtime = "nodejs"; // IMPORTANT: Mongoose needs Node runtime

export async function POST(request: NextRequest) {
  
  try {
    // parse body
    const body = await request.json();
    console.log("Request body:", body);

    // ensure DB connect and log readyState
    await dbConnect();
    console.log("Mongoose readyState:", mongoose.connection.readyState); // 1 = connected

    // sanity-check model
    console.log("TextCode imported:", !!TextCode);
    console.log("TextCode.create typeof:", typeof TextCode?.create);

    // minimal validation
    const required = ["title", "description", "uploadedBy", "content"];
    const missing = required.filter((k) => !body?.[k]);
    if (missing.length) {
      console.warn("Missing required fields:", missing);
      return NextResponse.json({ status: "fail", message: `Missing: ${missing.join(", ")}` }, { status: 400 });
    }

    const textData = {
      title: String(body.title),
      description: String(body.description),
      uploadedBy: String(body.uploadedBy),
      category: body.category || "General",
      content: String(body.content),
      tags: Array.isArray(body.tags) ? body.tags : [],
      likes: 0,
      downloads: 0,
    };

    // try-create and capture exact error
    let saved;
    try {
      saved = await TextCode.create(textData);
      console.log("Saved doc id:", saved?._id);
    } catch (createErr) {
      console.error("TextCode.create() error:", createErr);
      return NextResponse.json(
        { status: "error", message: createErr?.message || "create failed", details: createErr },
        { status: 500 }
      );
    }

    return NextResponse.json({ status: "success", data: saved }, { status: 201 });
  } catch (err: any) {
    console.error("Route top-level error:", err);
    return NextResponse.json({ status: "error", message: err?.message || "unknown" }, { status: 500 });
  }
}
