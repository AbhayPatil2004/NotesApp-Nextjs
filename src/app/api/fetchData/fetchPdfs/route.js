// app/api/fetchData/fetchPdfs/route.js
import { NextResponse } from "next/server";
import dbConnect from "@/dbConnect/db";
import Pdf from "@/models/pdfModel"; // adjust path if needed

export async function GET() {
  try {
    await dbConnect();
    console.log("Database connected (fetchPdfs)");

    // fetch all PDFs as plain objects
    const data = await Pdf.find({}).lean(); // .lean() returns plain objects

    const count = Array.isArray(data) ? data.length : 0;
    console.log(`Fetched ${count} pdf(s)`);

    // Always return the same shape your client expects
    return NextResponse.json(
      {
        ok: true,
        message: count === 0 ? "No PDFs found" : "PDFs fetched successfully",
        Pdfs: Array.isArray(data) ? data : [],
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("GET /api/fetchData/fetchPdfs error:", error);
    return NextResponse.json(
      { ok: false, message: `Error fetching PDFs: ${error?.message || error}` },
      { status: 500 }
    );
  }
}
