"use client";

import React, { createContext, useState, useEffect, useContext } from "react";
import { useSession } from "next-auth/react";
import axios from "axios";

export interface ProductType {
    _id: string;
    user: string;
    name: string;
    description?: string;
    price: number;
    category?: string;
    createdAt?: string;
    updatedAt?: string;
}

export interface ProductContextType {
    products: ProductType[] | null;
    setProducts: React.Dispatch<React.SetStateAction<ProductType[] | null>>;
    isLoading: boolean;
    error: string | null;
    refetchProducts: () => Promise<void>;
}

export const ProductContext = createContext<ProductContextType | null>(null);

export const useProductContext = () => {
    const context = useContext(ProductContext);

    if (!context) {
        throw new Error(
            "useProductContext must be used within ProductProvider"
        );
    }

    return context;
};

export const ProductProvider = ({
    children,
}: {
    children: React.ReactNode;
}) => {
    const [products, setProducts] = useState<ProductType[] | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const { data: session, status } = useSession();

    const fetchProducts = async () => {
        if (!session?.accessToken) {
            console.log("No access token available");
            return;
        }

        setIsLoading(true);
        setError(null);

        try {
            const response = await axios.get("/api/product", {
                headers: {
                    Authorization: `Bearer ${session.accessToken}`,
                },
            });

            const data = response.data;

            console.log("Product context fetching:", data); // Debug log

            // Case 1: Direct array
            if (Array.isArray(data)) {
                console.log("Direct array format detected");
                setProducts(data);
            }
            // Case 2: Nested array in products property
            else if (Array.isArray(data.products)) {
                console.log("Nested array format detected");
                setProducts(data.products);
            }
            // Case 3: Invalid format
            else {
                console.error("Invalid format received:", typeof data, data);
                setError("Invalid data format received");
            }
        } catch (error: any) {
            console.error("Fetch error:", error);
            setError(error.message || "Failed to fetch products");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (status === "authenticated" && session?.accessToken) {
            fetchProducts();
        }
    }, [status, session]);

    return (
        <ProductContext.Provider
            value={{
                products,
                setProducts,
                isLoading,
                error,
                refetchProducts: fetchProducts,
            }}
        >
            {children}
        </ProductContext.Provider>
    );
};
