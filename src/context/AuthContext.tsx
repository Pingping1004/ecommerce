"use client";

import { signOut, useSession } from "next-auth/react";
import React, { createContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface AuthContextType {
    isLoggedIn: boolean;
    isLoading: boolean;
    login: () => void;
    logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType>({
    isLoggedIn: false,
    isLoading: true,
    login: () => {},
    logout: async () => {},
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();
    const { data: session, status } = useSession();

    useEffect(() => {
        setIsLoggedIn(status === "authenticated");
        setIsLoading(status === "loading");
    }, [status]);

    const handleLogout = async () => {
        try {
            console.log('Logout function activated')
            await signOut({ redirect: false });
            setIsLoggedIn(false);
            router.push("/login");
        } catch (error) {
            console.error("Logout failed: ", error);
        }
    };

    const login = () => setIsLoggedIn(true);

    return (
        <AuthContext.Provider
            value={{
                isLoggedIn,
                isLoading,
                login,
                logout: handleLogout,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};
