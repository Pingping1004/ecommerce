import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "../auth/[...nextauth]/route";
import { addProduct, getProducts } from "@/features/products/productService";
import { verifyToken } from "@/lib/jwt";
import checkToken from "@/util/checkToken";

export const runtime = "nodejs"; // Ensure the API route uses the Node.js runtime

export async function GET(req: NextRequest) {
    try {
        checkToken(req); // Verify token using the utility function

        const products = await getProducts();
        console.log("Products being sent:", products); // Debug log
        return NextResponse.json(products); // Send array directly

    } catch (error) {
        console.error("Product fetch error:", error);
        return NextResponse.json(
            { error: "Failed to fetch products" },
            { status: 500 }
        );
    }
}

export async function POST(req: NextRequest) {
    try {
        const newProduct = await req.json();
        console.log("Added product: ", newProduct);

        // Validate the request body here if needed
        if (!newProduct) {
            console.error("Invalid request body");
            return NextResponse.json(
                { error: "Invalid request body" },
                { status: 400 }
            );
        }

        checkToken(req);

        const response = await addProduct(newProduct);
        return response;
    } catch (error: any) {
        console.error("Error adding product:", error.message);
        return NextResponse.json(
            { error: "Failed to add product" },
            { status: 500 }
        );
    }
}
