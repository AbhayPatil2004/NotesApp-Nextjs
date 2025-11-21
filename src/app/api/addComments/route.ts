// app/api/images/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/dbConnect/db";

import textContent from "../../../../models/text-code-Model";
import Image from "../../../../models/imageModel";
import Pdf from "../../../../models/pdfModel";

// helper function (generic)
async function addComment(id: string, model: any , comment : String ) {
    try {
        const updated = await model.findByIdAndUpdate(
            id,
            {
                $push: {
                    comments: {
                        comment
                    }
                }
            },
            { new: true }
        );

        if (!updated) {
            return NextResponse.json({ error: "Document not found" }, { status: 404 });
        }

        return NextResponse.json({
            message: "Commnet add Succesfull",
            data: updated
        });

    } catch (error: any) {
        console.error("Error incrementing download count:", error.message);
        return NextResponse.json(
            { ok: false, error: "Internal server error" },
            { status: 500 }
        );
    }
}

export async function PUT(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        await dbConnect();

        const { id } = params;
        const body = await request.json();
        const dataType = body.Type;
        const comment = body.comment ;

        if (!dataType || !comment) {
            return NextResponse.json(
                { ok: false, error: "DataType not found Or Comment is Missing" },
                { status: 400 }
            );
        }

        if (dataType === "textContent") {
            return await addComment(id, textContent , comment );
        }

        if (dataType === "Images") {
            return await addComment(id, Image , comment );
        }

        if (dataType === "Pdfs") {
            return await addComment(id, Pdf , comment );
        }

        return NextResponse.json(
            { ok: false, error: "Invalid DataType provided" },
            { status: 400 }
        );

    } catch (error: any) {
        console.error("PUT route error:", error.message);
        return NextResponse.json(
            { ok: false, error: "Internal server error" },
            { status: 500 }
        );
    }
}
