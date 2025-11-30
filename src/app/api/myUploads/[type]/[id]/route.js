import { NextResponse } from "next/server";
import dbConnect from "@/dbConnect/db";

import ImageModel from "@/models/imageModel";
import CodeModel from "@/models/text-code-Model";
import PdfModel from "@/models/pdfModel";

const MODEL_MAP = {
  image: ImageModel,
  code: CodeModel,
  pdf: PdfModel,
};

export async function DELETE(request, { params }) {
  try {
    await dbConnect();

    const type = params.type; // image / code / pdf
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

    const deleted = await Model.findByIdAndDelete(id);

    if (!deleted) {
      return NextResponse.json(
        { ok: false, message: `${type} not found` },
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
      { ok: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
