import { getSeller, registerSeller } from "@/features/seller/registerService";
import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/database";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
    try {
        await connectToDatabase();
        const sellerData = await req.json();

        const result = await registerSeller(req, sellerData);

        return NextResponse.json(
            {
                success: true,
                message: "Seller registered successfully",
                data: result,
            },
            { status: 201 }
        );
    } catch (error: any) {
        console.error("Failed to register seller:", error);
        return NextResponse.json(
            {
                success: false,
                message: error.message || "Failed to register seller",
            },
            { status: error.status || 500 }
        );
    }
}

export async function GET(req: NextRequest) {
    try {
        await connectToDatabase();
        const sellers = await getSeller();
        return NextResponse.json({ success: true, data: sellers });
    } catch (error: any) {
        return NextResponse.json(
            { success: false, message: error.message },
            { status: 500 }
        );
    }
}
