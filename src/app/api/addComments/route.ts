// app/api/images/[id]/route.ts
import { NextResponse } from "next/server";
import mongoose from "mongoose";
import dbConnect from "@/dbConnect/db";

import TextContent from "@/models/text-code-Model";
import ImageModel from "@/models/imageModel";
import PdfModel from "@/models/pdfModel";

type ModelType = mongoose.Model<any, {}, {}>; // adjust generics if you have stronger types

async function addComment(
  id: string,
  model: ModelType,
  commentText: string,
  userId?: string
) {
  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ ok: false, error: "Invalid id" }, { status: 400 });
    }

    const commentPayload: any = {
      comment: commentText,
      createdAt: new Date(),
    };

    if (userId && mongoose.Types.ObjectId.isValid(userId)) {
      commentPayload.user = userId;
    }

    const updated = await model.findByIdAndUpdate(
      id,
      { $push: { comments: commentPayload } },
      { new: true, runValidators: true }
    );

    if (!updated) {
      return NextResponse.json({ ok: false, error: "Document not found" }, { status: 404 });
    }

    return NextResponse.json({ ok: true, message: "Comment added successfully", data: updated });
  } catch (err: any) {
    console.error("Error adding comment:", err?.message ?? err);
    return NextResponse.json({ ok: false, error: "Internal server error" }, { status: 500 });
  }
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    await dbConnect();

    const { id } = params;
    const body = await request.json();

    // accept either 'type' or 'Type' from client, prefer lowercase
    const dataType: string | undefined = (body.type ?? body.Type);
    const comment: string | undefined = body.comment;
    const userId: string | undefined = body.userId; // optional

    if (!dataType || !comment) {
      return NextResponse.json({ ok: false, error: "type or comment missing in request body" }, { status: 400 });
    }

    if (typeof comment !== "string" || comment.trim().length === 0) {
      return NextResponse.json({ ok: false, error: "comment must be a non-empty string" }, { status: 400 });
    }

    const trimmedComment = comment.trim();
    const typeNormalized = String(dataType).toLowerCase();

    if (typeNormalized === "textcontent" || typeNormalized === "text") {
      return await addComment(id, TextContent, trimmedComment, userId);
    }

    if (typeNormalized === "images" || typeNormalized === "image") {
      return await addComment(id, ImageModel, trimmedComment, userId);
    }

    if (typeNormalized === "pdfs" || typeNormalized === "pdf") {
      return await addComment(id, PdfModel, trimmedComment, userId);
    }

    return NextResponse.json({ ok: false, error: "Invalid type provided" }, { status: 400 });
  } catch (err: any) {
    console.error("PUT route error:", err?.message ?? err);
    return NextResponse.json({ ok: false, error: "Internal server error" }, { status: 500 });
  }
}
