// app/api/images/upload/route.js
import { NextResponse } from "next/server";
import dbConnect from "@/dbConnect/db";
import Image from "@/models/imageModel";
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

    if (!cloudinary.config().cloud_name || !cloudinary.config().api_key || !cloudinary.config().api_secret) {
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

    // parse comments (optional)
    let comments = [];
    if (commentsRaw && typeof commentsRaw === "string") {
      comments = commentsRaw.split(",").map((c) => c.trim()).filter(Boolean);
    }

    // convert File to buffer
    const buffer = Buffer.from(await file.arrayBuffer());

    // upload to Cloudinary
    const uploadResult = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { folder: "nextjs-uploads" },
        (error, result) => {
          if (error) return reject(error);
          resolve(result);
        }
      );
      streamifier.createReadStream(buffer).pipe(uploadStream);
    });

    // create image document
    const imageDoc = {
      title,
      description,
      uploadedBy,
      category: category || "",
      cloudinaryUrl: uploadResult.secure_url || uploadResult.url,
      public_id: uploadResult.public_id,
      comments: [],
      likes: 0,
      downloads: 0,
      width: uploadResult.width,
      height: uploadResult.height,
      format: uploadResult.format,
    };

    const savedImage = await Image.create(imageDoc);

    return NextResponse.json({ ok: true, image: savedImage }, { status: 201 });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { ok: false, message: `Error uploading data: ${error.message || error}` },
      { status: 500 }
    );
  }
}
