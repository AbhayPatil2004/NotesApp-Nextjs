// app/api/content/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/dbConnect/db";

import textContent from "../../../../models/text-code-Model";
import Image from "../../../../models/imageModel";
import Pdf from "../../../../models/pdfModel";

// helper function (generic for likes)
async function updateLikes(id: string, model: any) {
  try {
    const updated = await model.findByIdAndUpdate(
      id,
      { $inc: { likes: 1 } },     // increment likes
      { new: true }
    );

    if (!updated) {
      return NextResponse.json({ error: "Document not found" }, { status: 404 });
    }

    return NextResponse.json({
      message: "Like count updated",
      data: updated
    });

  } catch (error: any) {
    console.error("Error incrementing Like count:", error.message);
    return NextResponse.json(
      { ok: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect();

    const { id } = params;
    const body = await request.json();
    const dataType = body.Type;

    if (!dataType) {
      return NextResponse.json(
        { ok: false, error: "DataType not found" },
        { status: 400 }
      );
    }

    if (dataType === "textContent") {
      return await updateLikes(id, textContent);
    }

    if (dataType === "Images") {
      return await updateLikes(id, Image);
    }

    if (dataType === "Pdfs") {
      return await updateLikes(id, Pdf);
    }

    return NextResponse.json(
      { ok: false, error: "Invalid DataType provided" },
      { status: 400 }
    );

  } catch (error: any) {
    console.error("PUT route error:", error.message);
    return NextResponse.json(
      { ok: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
