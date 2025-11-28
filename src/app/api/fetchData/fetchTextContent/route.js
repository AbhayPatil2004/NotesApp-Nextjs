// app/api/fetchData/fetchTextCodes/route.js
import { NextResponse } from "next/server";
import dbConnect from "@/dbConnect/db";
import TextCode from "@/models/text-code-Model";

export async function GET() {
  try {
    await dbConnect();
    console.log("Database connected");

    const data = await TextCode.find(); // returns an array

    // Return empty array if no documents found
    if (!data || data.length === 0) {
      return NextResponse.json(
        { ok: true, message: "No documents found", fetchedData: [] },
        { status: 200 }
      );
    }

    // Successful response with data
    return NextResponse.json(
      { ok: true, message: "Data fetched successfully", fetchedData: data },
      { status: 200 }
    );
  } catch (error) {
    console.error("GET /text-codes error:", error);
    return NextResponse.json(
      { ok: false, message: `Error fetching data: ${error?.message || error}` },
      { status: 500 }
    );
  }
}
