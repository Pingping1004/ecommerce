import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "../auth/[...nextauth]/route";
import { verifyToken } from "@/lib/jwt";
import { addProduct } from "@/features/products/productService";

export const runtime = "nodejs"; // Ensure the API route uses the Node.js runtime

export async function POST(req: NextRequest, res: NextResponse) {
    try {
        const newProduct = await req.json();
        console.log("Added product: ", newProduct);

        // Validate the request body here if needed
        if (!newProduct) {
            return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
        }

        const token = req.headers.get('Authorization')?.split(' ')[1];
        const session = await getServerSession(authOptions);

        if (!token && !session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const response = await addProduct(newProduct);
        return response;

    } catch (error: any) {
        console.error("Error adding product:", error.message);
        return NextResponse.json({ error: 'Failed to add product' }, { status: 500 });
    }
}