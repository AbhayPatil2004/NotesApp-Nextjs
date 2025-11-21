import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/dbConnect/db";
import PDF from "@/models/pdfModel";
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
    const cfg = cloudinary.config();
    if (!cfg.cloud_name || !cfg.api_key || !cfg.api_secret) {
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
    const commentsRaw = formData.get("comments") as string | null;

    // validate required fields
    if (!file || !title || !description || !uploadedBy) {
      return NextResponse.json(
        { ok: false, message: "Some required data is missing (file/title/description/uploadedBy)" },
        { status: 400 }
      );
    }
    console.log("Data fetched successfully");

    // basic file validations
    const mime = (file as File).type || "";
    const allowed = ["application/pdf"]; // only allow pdfs here — modify if you want others
    const MAX_BYTES = 20 * 1024 * 1024; // 20MB limit (adjust as needed)

    const buffer = Buffer.from(await (file as File).arrayBuffer());
    if (!allowed.includes(mime)) {
      return NextResponse.json({ ok: false, message: "Only PDF files are allowed" }, { status: 400 });
    }
    if (buffer.length > MAX_BYTES) {
      return NextResponse.json({ ok: false, message: `File too large. Max ${MAX_BYTES} bytes` }, { status: 400 });
    }

    // parse comments (accept comma separated string or single tag)
    let comments: string[] = [];
    if (commentsRaw && typeof commentsRaw === "string") {
      comments = commentsRaw.split(",").map((t) => t.trim()).filter(Boolean);
    }

    // decide upload options — PDFs should use resource_type: "raw"
    const isPdf = mime === "application/pdf";
    const uploadOptions: Record<string, any> = {
      folder: isPdf ? "pdfs" : "uploads",
      resource_type: isPdf ? "raw" : "auto", // raw for pdf, auto for other file types
      use_filename: true,
      unique_filename: true,
      // public_id: optional custom id
    };

    // upload to cloudinary using upload_stream
    const uploadResult = await new Promise<any>((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        uploadOptions,
        (error, result) => {
          if (error) return reject(error);
          resolve(result);
        }
      );
      streamifier.createReadStream(buffer).pipe(uploadStream);
    });

    // build pdf document object (do NOT store the binary)
    const pdfDoc: any = {
      title,
      description,
      uploadedBy,
      category: category ?? "",
      cloudinaryUrl: uploadResult.secure_url ?? uploadResult.url,
      public_id: uploadResult.public_id,
      resource_type: uploadResult.resource_type ?? (isPdf ? "raw" : "image"),
      comments,
      likes: 0,
      downloads: 0,
      format: uploadResult.format,
      bytes: uploadResult.bytes ?? buffer.length,
    };

    // (optional) include additional metadata returned by Cloudinary for PDFs
    if (uploadResult.pages !== undefined) pdfDoc.pages = uploadResult.pages; // Cloudinary may return number of pages
    if (uploadResult.original_filename) pdfDoc.original_filename = uploadResult.original_filename;

    // save to mongo
    const savedPdf = await PDF.create(pdfDoc);

    return NextResponse.json({ ok: true, pdf: savedPdf }, { status: 201 });
  } catch (error: any) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { ok: false, message: `Error in Uploading Data: ${error.message || error}` },
      { status: 500 }
    );
  }
}