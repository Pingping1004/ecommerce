import {
    getSellerById,
    updateSellerStatus,
} from "@/features/seller/sellerService";
import { NextRequest, NextResponse } from "next/server";
import checkToken from "@/util/checkToken";
import { getToken } from "next-auth/jwt";
import { authOptions } from "../../auth/[...nextauth]/route";

export async function GET(
    req: NextRequest,
    { params }: { params: { userId: string } }
) {
    try {
        checkToken(req);
        const { userId } = params;

        const seller = await getSellerById(userId);
        console.log("Find seller by ID API: ", seller);
        return NextResponse.json(seller, { status: 200 });
    } catch (error: any) {
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}

export async function PATCH(
    req: NextRequest,
    { params }: { params: { userId: string } }
) {
    try {
        checkToken(req);
        const { status } = await req.json();
        const userId = params.userId; // Access directly without destructuring

        console.log("Raw body: ", { status });
        console.log("userId from params: ", userId);

        const updatedSeller = await updateSellerStatus(status, userId);

        return NextResponse.json(
            {
                success: true,
                message: "Status updated successfully",
                data: updatedSeller,
            },
            { status: 200 }
        );
    } catch (error: any) {
        console.error("Status update error:", error);
        return NextResponse.json(
            {
                success: false,
                message: error.message || "Failed to update status",
            },
            { status: 500 }
        );
    }
}
