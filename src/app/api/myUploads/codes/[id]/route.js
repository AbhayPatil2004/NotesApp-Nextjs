import { NextResponse } from "next/server";
import TextCode from "@/models/text-code-Model";
import User from "@/models/User.Model";
import dbConnect from "@/dbConnect/db";

export async function GET(request, { params }) {
  console.log("===== API HIT: /api/myUploads/codes/[id] =====");

  try {
    console.log("➡️ Connecting to database...");
    await dbConnect();
    console.log("✔️ Database connected successfully");

    console.log("➡️ Raw request URL:", request.url);
    console.log("➡️ Raw params received (before resolving):", params);

    // params may be a Promise in your environment → resolve it
    const resolvedParams =
      typeof params?.then === "function" ? await params : params || {};

    console.log("✔️ Resolved params:", resolvedParams);

    // Either userName or id (folder name)
    const userName = resolvedParams.userName ?? resolvedParams.id;

    console.log("➡️ Extracted userName param:", userName);

    if (!userName) {
      console.log("❌ Error: Missing userName param in URL");
      return NextResponse.json(
        { message: "Missing required param: userName" },
        { status: 400 }
      );
    }

    console.log(`➡️ Searching for user: ${userName} in database...`);
    const findUser = await User.findOne({ userName });

    console.log("✔️ User lookup result:", findUser);

    if (!findUser) {
      console.log(`❌ No user found with userName: ${userName}`);
      return NextResponse.json(
        { message: `User not found with userName ${userName}` },
        { status: 404 }
      );
    }

    console.log(`➡️ Fetching codes uploaded by: ${userName}...`);
    const myCodes = await TextCode.find({ uploadedBy: userName });

    console.log(`✔️ Codes fetched (${myCodes.length} items):`, myCodes);

    console.log("===== SUCCESS: Returning response =====");

    return NextResponse.json(
      {
        message: "Data fetched successfully",
        body: myCodes,
        count: myCodes.length,
      },
      { status: 200 }
    );

  } catch (error) {
    console.error("❌ GET /api/myUploads/codes error:", error);

    return NextResponse.json(
      { message: "Internal Server Error", error: String(error) },
      { status: 500 }
    );
  }
}
