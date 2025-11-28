// app/api/pdfs/upload/route.js
import { NextResponse } from "next/server";
import dbConnect from "@/dbConnect/db";
import PDF from "@/models/pdfModel";
import { v2 as cloudinary } from "cloudinary";
import streamifier from "streamifier";

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(request) {
  try {
    await dbConnect();
    console.log("Database Connected");

    const cfg = cloudinary.config();
    if (!cfg.cloud_name || !cfg.api_key || !cfg.api_secret) {
      return NextResponse.json({ ok: false, error: "Cloudinary credentials not found" }, { status: 500 });
    }

    const formData = await request.formData();
    const file = formData.get("file");
    const title = formData.get("title");
    const description = formData.get("description");
    const uploadedBy = formData.get("uploadedBy");
    const category = formData.get("category");
    const commentsRaw = formData.get("comments");

    if (!file || !title || !description || !uploadedBy) {
      return NextResponse.json(
        { ok: false, message: "Missing required data (file/title/description/uploadedBy)" },
        { status: 400 }
      );
    }

    // validate file type and size
    const mime = file.type || "";
    const allowed = ["application/pdf"];
    const MAX_BYTES = 20 * 1024 * 1024; // 20MB

    const buffer = Buffer.from(await file.arrayBuffer());
    if (!allowed.includes(mime)) return NextResponse.json({ ok: false, message: "Only PDF files are allowed" }, { status: 400 });
    if (buffer.length > MAX_BYTES) return NextResponse.json({ ok: false, message: `File too large. Max ${MAX_BYTES} bytes` }, { status: 400 });

    // parse comments
    let comments = [];
    if (commentsRaw && typeof commentsRaw === "string") {
      comments = commentsRaw.split(",").map((c) => c.trim()).filter(Boolean);
    }

    // Cloudinary upload options
    const uploadOptions = {
      folder: "pdfs",
      resource_type: "raw",
      use_filename: true,
      unique_filename: true,
    };

    const uploadResult = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(uploadOptions, (error, result) => {
        if (error) return reject(error);
        resolve(result);
      });
      streamifier.createReadStream(buffer).pipe(uploadStream);
    });

    const pdfDoc = {
      title,
      description,
      uploadedBy,
      category: category || "",
      cloudinaryUrl: uploadResult.secure_url || uploadResult.url,
      public_id: uploadResult.public_id,
      resource_type: uploadResult.resource_type || "raw",
      comments: [],
      likes: 0,
      downloads: 0,
      format: uploadResult.format,
      bytes: uploadResult.bytes || buffer.length,
    };

    if (uploadResult.pages !== undefined) pdfDoc.pages = uploadResult.pages;
    if (uploadResult.original_filename) pdfDoc.original_filename = uploadResult.original_filename;

    const savedPdf = await PDF.create(pdfDoc);

    return NextResponse.json({ ok: true, pdf: savedPdf }, { status: 201 });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json({ ok: false, message: `Error uploading data: ${error.message || error}` }, { status: 500 });
  }
}
