// app/api/<your-route>/route.js  (or wherever your DELETE handler lives)
import { NextResponse } from "next/server";
import dbConnect from "@/dbConnect/db";

import ImageModel from "@/models/imageModel";
import CodeModel from "@/models/text-code-Model";
import PdfModel from "@/models/pdfModel";

import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const MODEL_MAP = {
  image: ImageModel,
  code: CodeModel,
  pdf: PdfModel,
};


function extractPublicIdFromUrl(url) {
  if (!url || typeof url !== "string") return null;

  try {
    const decoded = decodeURIComponent(url);

    
    const uploadIndex = decoded.indexOf("/upload/");
    if (uploadIndex === -1) {
      
      return decoded.split(".").slice(0, -1).join(".") || decoded;
    }

    
    let afterUpload = decoded.substring(uploadIndex + "/upload/".length);

    
    afterUpload = afterUpload.replace(/^v\d+\//, "");

    // remove any query string
    afterUpload = afterUpload.split("?")[0];

    
    const lastDot = afterUpload.lastIndexOf(".");
    if (lastDot !== -1) {
      afterUpload = afterUpload.substring(0, lastDot);
    }

    
    return afterUpload.replace(/^\/+/, "");
  } catch (e) {
    return null;
  }
}

export async function DELETE(request, { params }) {
  try {
    await dbConnect();

    const type = params.type; 
    const id = params.id;

    if (!type || !id) {
      return NextResponse.json(
        { ok: false, message: "Missing type or id in URL" },
        { status: 400 }
      );
    }

    const Model = MODEL_MAP[type];

    if (!Model) {
      return NextResponse.json(
        { ok: false, message: `Invalid type: ${type}` },
        { status: 400 }
      );
    }

    
    const doc = await Model.findById(id);
    if (!doc) {
      return NextResponse.json(
        { ok: false, message: `${type} not found` },
        { status: 404 }
      );
    }

    
    const cloudinaryUrl = doc.cloudinaryUrl || doc.cloudinaryURL || doc.cloudinary || null;

    if (cloudinaryUrl) {
      const publicId = extractPublicIdFromUrl(cloudinaryUrl);

      if (publicId) {
        try {
          
          if (type === "pdf") {
            await cloudinary.uploader.destroy(publicId, { resource_type: "raw" });
            console.log("Pdf Deleted")
          } else {
            
            await cloudinary.uploader.destroy(publicId);
            console.log("Image Deleted")
          }
        } catch (cloudErr) {
          console.error("Cloudinary delete error:", cloudErr);
          
          return NextResponse.json(
            { ok: false, message: "Failed to delete file from Cloudinary", error: String(cloudErr) },
            { status: 500 }
          );
        }
      } else {
        console.warn("Could not extract Cloudinary public_id from URL:", cloudinaryUrl);
        
      }
    } else {
      console.log("No cloudinaryUrl found on document; skipping Cloudinary delete.");
    }

    
    const deleted = await Model.findByIdAndDelete(id);

    if (!deleted) {
      return NextResponse.json(
        { ok: false, message: `${type} not found when deleting` },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { ok: true, message: `${type} deleted successfully`, body: deleted },
      { status: 200 }
    );
  } catch (err) {
    console.error("DELETE error:", err);
    return NextResponse.json(
      { ok: false, message: "Internal server error", error: String(err) },
      { status: 500 }
    );
  }
}
