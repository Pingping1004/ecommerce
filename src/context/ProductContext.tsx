"use client";

import React, { createContext, useState, useContext, useEffect } from "react";
import { useSession } from "next-auth/react";
import axios from "axios";
import { AuthContext } from "./AuthContext";

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

const ProductContext = createContext<ProductContextType>({
    products: null,
    setProducts: () => {},
});

export const ProductProvider = ({ children }: { children: React.ReactNode }) => {
    const { isLoggedIn } = useContext(AuthContext);
    const [products, setProducts] = useState<ProductType[] | null>(null);
    const { data: session } = useSession();
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

        if (isLoggedIn && token) {
            fetchProducts();
        }
    }, [isLoggedIn, token]);

    return (
        <ProductContext.Provider
            value={{
                products, 
                setProducts,
            }}
        >
            {children}
        </ProductContext.Provider>
    );
};

export default ProductContext;