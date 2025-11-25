// // app/api/images/[id]/route.ts
// import { NextRequest, NextResponse } from "next/server";
// import dbConnect from "@/dbConnect/db";

// import textContent from "../../../../models/text-code-Model";
// import Image from "../../../../models/imageModel";
// import Pdf from "../../../../models/pdfModel";

// // helper function (generic)
// async function updateDownloadCount(id: string, model: any) {
//   try {
//     const updated = await model.findByIdAndUpdate(
//       id,
//       { $inc: { downloads: 1 } },
//       { new: true }
//     );

//     if (!updated) {
//       return NextResponse.json({ error: "Document not found" }, { status: 404 });
//     }

//     return NextResponse.json({
//       message: "Download count updated",
//       data: updated
//     });

//   } catch (error: any) {
//     console.error("Error incrementing download count:", error.message);
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
//       return await updateDownloadCount(id, textContent);
//     }

//     if (dataType === "Images") {
//       return await updateDownloadCount(id, Image);
//     }

//     if (dataType === "Pdfs") {
//       return await updateDownloadCount(id, Pdf);
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


// app/api/images/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/dbConnect/db";
import Image from "@/models/imageModel";
import mongoose from "mongoose";

async function incrementDownloads(id: string) {
  const updated = await Image.findByIdAndUpdate(
    id,
    { $inc: { downloads: 1 } },
    { new: true, runValidators: true }
  );

  if (!updated) {
    return NextResponse.json({ ok: false, error: "Image not found" }, { status: 404 });
  }

  return NextResponse.json({ ok: true, image: updated.toObject() }, { status: 200 });
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await dbConnect();

    const { id } = params;
    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ ok: false, error: "Invalid id" }, { status: 400 });
    }

    // We accept optional Type in body but default to Images
    const body = await request.json().catch(() => ({}));
    const Type = body.Type || "Images";

    if (Type !== "Images") {
      return NextResponse.json({ ok: false, error: "Invalid DataType provided" }, { status: 400 });
    }

    return await incrementDownloads(id);
  } catch (err: any) {
    console.error("PUT /api/images/[id] error:", err);
    return NextResponse.json({ ok: false, error: "Internal server error" }, { status: 500 });
  }
}
