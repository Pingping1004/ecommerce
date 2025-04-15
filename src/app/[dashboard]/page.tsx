"use client";

import React, { useContext } from "react";
import { UserContext, UserContextType } from "@/context/UserContext";
import { ProductContext, ProductContextType } from "@/context/ProductContext";
import { useRouter } from "next/navigation";
import { logoutUser } from "@/features/auth/authService";

export default function DashboardPage() {
    const userContext = useContext<UserContextType | null>(UserContext);
    const productContext = useContext<ProductContextType | null>(ProductContext);
    const router = useRouter();

    const logout = async () => {
        try {
            await logoutUser();
            router.push('/login');
        } catch (error) {
            console.error('Logout failed', error);
        }
    }

    if (!userContext || !productContext) {
        return <div>Loading...</div>;
    }

    const { user } = userContext;
    const { products } = productContext;

    return (
        <>
            <div>
                <button
                    className="bg-white text-black p-2 rounded-md hover:bg-gray-200 cursor-pointer"
                    onClick={logout}
                >
                    Logout
                </button>
                <h1>{user?.username}</h1>
                <h1>User</h1>
            </div>
        </>
    );
}
