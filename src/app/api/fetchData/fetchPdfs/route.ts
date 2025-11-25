// app/api/fetchData/fetchPdfs/route.ts
import { NextResponse } from "next/server";
import dbConnect from "@/dbConnect/db";
import Pdf from "@/models/pdfModel"; // use alias import if configured; adjust path if not

export async function GET() {
  try {
    await dbConnect();
    console.log("Database connected (fetchPdfs)");

    // fetch all PDFs as plain objects
    const data = await Pdf.find({}).lean();

    const count = Array.isArray(data) ? data.length : 0;
    console.log(`Fetched ${count} pdf(s)`);

    // Always return the same shape your client expects:
    // payload.Pdfs  (client code checks payload.Pdfs || payload.pdfs || payload.data)
    return NextResponse.json(
      {
        ok: true,
        message: count === 0 ? "No PDFs found" : "PDFs fetched successfully",
        Pdfs: Array.isArray(data) ? data : [],
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("GET /api/fetchData/fetchPdfs error:", error);
    return NextResponse.json(
      { ok: false, message: `Error fetching PDFs: ${error?.message || error}` },
      { status: 500 }
    );
  }
}
