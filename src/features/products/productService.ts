import Product, { ProductType } from "@/models/Product";
import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/database";

export async function addProduct(newProduct: ProductType) {
    try {
        await connectToDatabase();
        console.log('New product before adding: ', newProduct); 
        if (!newProduct) throw new Error("Product data is required");

        const product = new Product(newProduct);
        await product.save();
        console.log("Added product: ", newProduct);
        return NextResponse.json(product, { status: 201 });
    } catch (error: any) {
        console.error("Error adding product:", error.message);
        return NextResponse.json({ error: 'Failed to add product' }, { status: 500 });
    }
}