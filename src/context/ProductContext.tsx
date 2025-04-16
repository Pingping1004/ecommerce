"use client";

import { createContext, useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import axios from "axios";

export interface ProductType {
    name: string;
    description?: string;
    price: number;
    category?:
        | "Apparel"
        | "Electronics"
        | "Home"
        | "Beauty&Health"
        | "Sports"
        | "Books"
        | "Toys"
        | "N/A";
}

export interface ProductContextType {
    products: ProductType[] | null;
    setProducts: React.Dispatch<React.SetStateAction<ProductType[] | null>>;
}

export const ProductContext = createContext<ProductContextType | null>(null);

export const ProductProvider = ({
    children,
}: {
    children: React.ReactNode;
}) => {
    const [products, setProducts] = useState<ProductType[] | null>([]);
    const { data: session, status } = useSession();
    const token = session?.accessToken;

    useEffect(() => {
        async function fetchProducts() {
            try {
                const response = await axios.get("/api/product", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                const productData = response.data.products;
                console.log("Fetched products: ", productData);
                setProducts(productData);
            } catch (error) {
                console.error("Failed to fetch products context", error);
            }
        }

        if (status === "authenticated" && token) {
            fetchProducts();
        }
    }, [status, token]);

    return (
        <ProductContext.Provider value={{ products, setProducts }}>
            {children}
        </ProductContext.Provider>
    );
};
