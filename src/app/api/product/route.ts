import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "../auth/[...nextauth]/route";
import {
    addProduct,
    getProducts,
    updateProduct,
} from "@/features/products/productService";
import { verifyToken } from "@/lib/jwt";
import checkToken from "@/util/checkToken";

// export const runtime = "nodejs";

export async function GET(req: NextRequest) {
    try {
        checkToken(req); // Verify token using the utility function

        const productData = await getProducts();
        console.log("Products being sent:", productData); // Debug log
        return NextResponse.json(productData); // Send array directly
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
        const productData = await req.json();
        // const { ownerId } = productData;
        console.log("Added product in API: ", productData);

        // Validate the request body here if needed
        if (!productData) {
            console.error("Invalid request body");
            return NextResponse.json(
                { error: "Invalid request body" },
                { status: 400 }
            );
        }

        // Make sure ownerId is included in the request
        if (!productData.ownerId) {
            return NextResponse.json(
                { error: "ownerId is required" },
                { status: 400 }
            );
        }

        checkToken(req);

        const response = await addProduct(productData);
        return response;
    } catch (error: any) {
        console.error("Error adding product: ", error.message);
        return NextResponse.json(
            { error: "Failed to add product" },
            { status: 500 }
        );
    }
}

export async function PATCH(req: NextRequest) {
    try {
        const data = await req.json();
        console.log("Received update data in API:", data);

        // Ensure we have both userId and productId
        const { userId, productId, ...updatedProduct } = data;
        // const productId = _id;

        if (!productId || !userId) {
            return NextResponse.json(
                {
                    error: "Missing required fields: productId and userId are required",
                },
                { status: 400 }
            );
        }

        checkToken(req);
        const product = await updateProduct(userId, productId, updatedProduct);

        return NextResponse.json(
            {
                success: true,
                data: product,
            },
            { status: 200 }
        );
    } catch (error: any) {
        console.error("Failed to update product:", error);
        return NextResponse.json(
            {
                success: false,
                error: error.message || "Failed to update product",
            },
            { status: 500 }
        );
    }
}
