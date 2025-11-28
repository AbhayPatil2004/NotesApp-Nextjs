// app/api/auth/login/route.js
import { NextResponse } from "next/server";
import User from "@/models/User.Model";
import bcrypt from "bcryptjs";
import dbConnect from "@/dbConnect/db";

async function checkPassword(plainPassword, hashedPassword) {
  return await bcrypt.compare(plainPassword, hashedPassword);
}

export async function POST(request) {
  try {
    await dbConnect();
    console.log("Database Connected");

    const body = await request.json();
    const email = (body.email || "").toString().trim().toLowerCase();
    const password = (body.password || "").toString();

    if (!email || !password) {
      return NextResponse.json(
        { ok: false, message: "Please provide valid email and password" },
        { status: 400 }
      );
    }

    const existingUser = await User.findOne({ email }).lean();

    if (!existingUser) {
      return NextResponse.json(
        { ok: false, message: "Invalid email or password" },
        { status: 401 }
      );
    }

    const dbPassword = existingUser.password;
    if (!dbPassword) {
      return NextResponse.json(
        { ok: false, message: "Invalid email or password" },
        { status: 401 }
      );
    }

    const isValid = await checkPassword(password, dbPassword);
    if (!isValid) {
      return NextResponse.json(
        { ok: false, message: "Invalid email or password" },
        { status: 401 }
      );
    }

    const safeUser = {
      _id: String(existingUser._id),
      username: existingUser.username || existingUser.userName || null,
      email: existingUser.email,
      createdAt: existingUser.createdAt,
    };

    return NextResponse.json(
      { ok: true, message: "Login successful", user: safeUser },
      { status: 200 }
    );
  } catch (err) {
    console.error("[login] error:", err);
    return NextResponse.json(
      { ok: false, message: "Something went wrong", error: err?.message || String(err) },
      { status: 500 }
    );
  }
}
