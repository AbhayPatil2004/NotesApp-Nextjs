// // app/api/content/[id]/route.ts
// import { NextRequest, NextResponse } from "next/server";
// import dbConnect from "@/dbConnect/db";

// import TextContent from "@/models/text-code-Model";
// import Image from "@/models/imageModel";
// import Pdf from "@/models/pdfModel";

// // helper function (generic for likes)
// async function updateLikes(id: string, model: any) {

//   try {
//     const updated = await model.findByIdAndUpdate(
//       id,
//       { $inc: { likes: 1 } },     // increment likes
//       { new: true }
//     );

//     if (!updated) {
//       return NextResponse.json({ error: "Document not found" }, { status: 404 });
//     }

//     return NextResponse.json({
//       message: "Like count updated",
//       data: updated
//     });

//   } catch (error: any) {
//     console.error("Error incrementing Like count:", error.message);
//     return NextResponse.json(
//       { ok: false, error: "Internal server error" },
//       { status: 500 }
//     );
//   }
// }

// export async function PUT(
//   request: NextRequest,
//   { params }: { params: { id: string } }
// ) {
//   try {
//     await dbConnect();

//     const { id } = params;
//     const body = await request.json();
//     const dataType = body.Type;

//     if (!dataType) {
//       return NextResponse.json(
//         { ok: false, error: "DataType not found" },
//         { status: 400 }
//       );
//     }

//     if (dataType === "textContent") {

      
//       return await updateLikes(id, textContent);
//     }

//     if (dataType === "Images") {
//       return await updateLikes(id, Image);
//     }

//     if (dataType === "Pdfs") {
//       return await updateLikes(id, Pdf);
//     }

//     return NextResponse.json(
//       { ok: false, error: "Invalid DataType provided" },
//       { status: 400 }
//     );

//   } catch (error: any) {
//     console.error("PUT route error:", error.message);
//     return NextResponse.json(
//       { ok: false, error: "Internal server error" },
//       { status: 500 }
//     );
//   }
// }


// app/api/content/[id]/route.ts
import { NextResponse } from "next/server";
import mongoose from "mongoose";
import dbConnect from "@/dbConnect/db";

import TextContent from "@/models/text-code-Model";
import ImageModel from "@/models/imageModel";
import PdfModel from "@/models/pdfModel";

type ModelType = any; // tighten to mongoose.Model if you want

// helper function (generic for likes)
async function updateLikes(id: string, model: ModelType) {
  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ ok: false, error: "Invalid id" }, { status: 400 });
    }

    const updated = await model.findByIdAndUpdate(
      id,
      { $inc: { likes: 1 } }, // increment likes
      { new: true, runValidators: true }
    );

    if (!updated) {
      return NextResponse.json({ ok: false, error: "Document not found" }, { status: 404 });
    }

    return NextResponse.json({ ok: true, message: "Like count updated", data: updated });
  } catch (error: any) {
    console.error("Error incrementing Like count:", error?.message ?? error);
    return NextResponse.json({ ok: false, error: "Internal server error" }, { status: 500 });
  }
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    await dbConnect();

    const { id } = params;
    const body = await request.json().catch(() => ({}));
    // accept either 'type' or 'Type'
    const dataType: string | undefined = (body.type ?? body.Type);

    if (!dataType) {
      return NextResponse.json({ ok: false, error: "DataType not provided" }, { status: 400 });
    }

    const typeNormalized = String(dataType).toLowerCase();

    if (typeNormalized === "textcontent" || typeNormalized === "text") {
      return await updateLikes(id, TextContent);
    }

    if (typeNormalized === "images" || typeNormalized === "image") {
      return await updateLikes(id, ImageModel);
    }

    if (typeNormalized === "pdfs" || typeNormalized === "pdf") {
      return await updateLikes(id, PdfModel);
    }

    return NextResponse.json({ ok: false, error: "Invalid DataType provided" }, { status: 400 });
  } catch (error: any) {
    console.error("PUT route error:", error?.message ?? error);
    return NextResponse.json({ ok: false, error: "Internal server error" }, { status: 500 });
  }
}
