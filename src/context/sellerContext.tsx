"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { SellerFormData } from "@/components/seller/Form";
import { useSession } from "next-auth/react";
import axios from "axios";
import { useAuth } from "@/hooks/useAuth";

export interface SellerContextType {
    sellers: SellerFormData[] | null;
    setSellers: React.Dispatch<React.SetStateAction<SellerFormData[] | null>>;
    isLoading: boolean;
    error: string | null;
}

export const SellerContext = createContext<SellerContextType | null>(null);

export const useSellerContext = () => {
    const context = useContext(SellerContext);
    if (!context) throw new Error();

    return context;
};

export const SellerProvider = ({ children }: { children: React.ReactNode }) => {
    const [sellers, setSellers] = useState<SellerFormData[] | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    
    const { isLoggedIn } = useAuth();
    const { data: session, status } = useSession();

    const fetchProducts = async () => {
        if (!session?.accessToken) {
            console.log("No access token available");
            return;
        }

        setIsLoading(true);
        setError(null);

        try {
            const response = await axios.get("/api/seller/register", {
                headers: {
                    Authorization: `Bearer ${session.accessToken}`,
                },
            });

            const sellersData = response.data.data;

            console.log("Sellers context fetching:", sellersData); // Debug log
            setSellers(sellersData);
        } catch (error: any) {
            console.error("Fetch error:", error);
            setError(error.message || "Failed to fetch products");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (status === 'authenticated' && session?.accessToken) fetchProducts();
    }, [status, session]);

    return (
        <SellerContext.Provider
            value={{ sellers, setSellers, isLoading, error }}
        >
            {children}
        </SellerContext.Provider>
    );
};
