// app/api/textcode/route.js
import { NextResponse } from "next/server";
import mongoose from "mongoose";
import dbConnect from "@/dbConnect/db";
import TextCode from "@/models/text-code-Model";

export const runtime = "nodejs"; 

export async function POST(request) {
  try {
    const body = await request.json();
    console.log("Request body keys:", Object.keys(body));

    await dbConnect();
    console.log("Mongoose readyState:", mongoose.connection.readyState);

    const required = ["title", "description", "uploadedBy", "content"];
    const missing = required.filter((k) => !body?.[k]);
    if (missing.length) {
      console.warn("Missing required fields:", missing);
      return NextResponse.json(
        { status: "fail", message: `Missing: ${missing.join(", ")}` },
        { status: 400 }
      );
    }

    const textData = {
      title: String(body.title),
      description: String(body.description),
      uploadedBy: String(body.uploadedBy),
      category: body.category || "General",
      content: String(body.content),
      comments: Array.isArray(body.comments) ? body.comments : [],
    };

    let saved;
    try {
      saved = await TextCode.create(textData);
      console.log("Saved doc id:", saved?._id);
    } catch (createErr) {
      console.error("TextCode.create() error:", createErr);
      return NextResponse.json(
        { status: "error", message: createErr?.message || "create failed" },
        { status: 500 }
      );
    }

    return NextResponse.json({ status: "success", data: saved }, { status: 201 });
  } catch (err) {
    console.error("Route top-level error:", err);
    return NextResponse.json(
      { status: "error", message: err?.message || "unknown" },
      { status: 500 }
    );
  }
}
