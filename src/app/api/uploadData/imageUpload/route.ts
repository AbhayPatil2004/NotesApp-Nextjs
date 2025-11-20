import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/dbConnect/db";
import Image from "../../../models/imageModel";
import { v2 as cloudinary } from "cloudinary";
import streamifier from "streamifier";

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(request: NextRequest) {
  try {
    // connect DB
    await dbConnect();
    console.log("Database Connected");

    // validate cloudinary config
    if (!cloudinary.config().cloud_name || !cloudinary.config().api_key || !cloudinary.config().api_secret) {
      return NextResponse.json(
        { ok: false, error: "Cloudinary credentials not found" },
        { status: 500 }
      );
    }
    console.log("Cloudinary keys fetched");

    // read formData
    const formData = await request.formData();

    const file = formData.get("file") as File | null;
    const title = formData.get("title") as string | null;
    const description = formData.get("description") as string | null;
    const uploadedBy = formData.get("uploadedBy") as string | null;
    const category = formData.get("category") as string | null;
    const tagsRaw = formData.get("tags") as string | null;

    // validate required fields (adjust required fields to your needs)
    if (!file || !title || !description || !uploadedBy) {
      return NextResponse.json(
        { ok: false, message: "Some required data is missing (file/title/description/uploadedBy)" },
        { status: 400 }
      );
    }
    console.log("Data fetched successfully");

    // parse tags (accept comma separated string or single tag)
    let tags: string[] = [];
    if (tagsRaw) {
      if (typeof tagsRaw === "string") {
        tags = tagsRaw.split(",").map((t) => t.trim()).filter(Boolean);
      }
    }

    // turn File into buffer
    const buffer = Buffer.from(await (file as File).arrayBuffer());

    // upload to cloudinary using upload_stream
    const uploadResult = await new Promise<any>((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { folder: "nextjs-uploads" }, // optional: change folder or other upload options
        (error, result) => {
          if (error) return reject(error);
          resolve(result);
        }
      );
      streamifier.createReadStream(buffer).pipe(uploadStream);
    });

    // build image document object (do NOT store the binary)
    const imageDoc = {
      title,
      description,
      uploadedBy,
      category: category ?? "",
      cloudinaryUrl: uploadResult.secure_url ?? uploadResult.url,
      public_id: uploadResult.public_id,
      tags,
      likes: 0,
      downloads: 0,
      width: uploadResult.width,
      height: uploadResult.height,
      format: uploadResult.format,
    };

    // save to mongo
    const savedImage = await Image.create(imageDoc);

    return NextResponse.json({ ok: true, image: savedImage }, { status: 201 });
  } catch (error: any) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { ok: false, message: `Error in Uploading Data: ${error.message || error}` },
      { status: 500 }
    );
  }
}