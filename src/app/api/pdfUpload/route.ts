import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import dbConnect from "@/dbConnect/db";
import TextCode from "../../../models/text-code-Model";