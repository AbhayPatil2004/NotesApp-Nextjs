// /app/api/auth/signup/route.ts (or wherever your route lives)
import { NextResponse, NextRequest } from "next/server";
import User from "@/models/User.Model";
import bcrypt from "bcryptjs";
import dbConnect from "@/dbConnect/db";
import mongoose from "mongoose";

async function hashPassword(plainPassword: string) {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(plainPassword, salt);
}

export async function POST(request: NextRequest) {
  try {
    // connect to DB
    await dbConnect();
    console.log("[signup] DB connected");

    // parse body (IMPORTANT: await)
    const body = await request.json();
    const userName = (body.userName || "").toString().trim();
    const email = (body.email || "").toString().trim().toLowerCase();
    const password = (body.password || "").toString();

    console.log("[signup] payload:", { userName, email, passwordProvided: !!password });

    // simple validations
    if (!userName || !email || !password) {
      return NextResponse.json({ ok: false, message: "Incomplete credentials" }, { status: 400 });
    }
    if (password.length < 6) {
      return NextResponse.json({ ok: false, message: "Password must be at least 6 characters" }, { status: 400 });
    }
    if (!email.endsWith("@gmail.com")) {
      return NextResponse.json({ ok: false, message: "Email must end with @gmail.com" }, { status: 400 });
    }

    // check existing
    const existingUser = await User.findOne({ email }).lean();
    if (existingUser) {
      return NextResponse.json({ ok: false, message: "User already exists" }, { status: 409 });
    }

    // hash and create
    const hashedPassword = await hashPassword(password);
    const newUser = await User.create({ userName, email, password: hashedPassword });

    // respond without password
    const safeUser = { _id: newUser._id, userName: newUser.userName, email: newUser.email, createdAt: newUser.createdAt };
    return NextResponse.json({ ok: true, message: "User created", body: safeUser }, { status: 201 });
  } catch (err: any) {
    // helpful debug logging
    console.error("[signup] error:", err);
    // handle common mongoose unique index race condition
    if (err?.code === 11000) {
      return NextResponse.json({ ok: false, message: "Email already registered (duplicate key)" }, { status: 409 });
    }
    // return actual message while debugging (you can hide this later)
    return NextResponse.json({ ok: false, message: "Something went wrong", error: err?.message || String(err) }, { status: 500 });
  }
}
