"use client";

import React, { useContext } from "react";
import { useRouter } from "next/navigation";
import { signOut } from "next-auth/react";
import { AuthContext } from "@/context/AuthContext";

export default function NavBar() {
    const router = useRouter();
    const { isLoggedIn, logout } = useContext(AuthContext);

    return (
        <>
            {isLoggedIn ? (
                <nav className="flex justify-between items-center py-6 bg-gray-800 text-white">
                    <h2 className="text-xl lato-bold ml-14">
                        Explore Products
                    </h2>

                    <button
                        className="bg-white text-primary lato-bold mr-14 px-4 py-2 rounded-lg cursor-pointer"
                        onClick={() => {logout}}
                    >
                        Profile
                    </button>
                </nav>
            ) : (
                <nav className="flex justify-between items-center py-6 bg-gray-800 text-white">
                    <h2 className="text-xl lato-bold ml-14">
                        Explore Products
                    </h2>

                    <button
                        className="bg-white text-primary lato-bold mr-14 px-4 py-2 rounded-lg cursor-pointer"
                        onClick={() => {
                            router.push("/login");
                        }}
                    >
                        Login
                    </button>
                </nav>
            )}
        </>
    );
}