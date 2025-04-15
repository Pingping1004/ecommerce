"use client";

import {
    createContext,
    useState,
    useEffect,
    Dispatch,
    SetStateAction,
} from "react";
import axios from "axios";
import { useSession } from "next-auth/react";

export interface UserType {
    email: string;
    username: string;
    role: string;
    image?: string;
}

export interface UserContextType {
    user: UserType | null;
    setUser: Dispatch<SetStateAction<UserType | null>>;
}

export const UserContext = createContext<UserContextType | null>(null);

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<UserType | null>(null);
    const { data: session, status } = useSession();
    const token = session?.accessToken;

    useEffect(() => {
        async function fetchUser() {
            try {
                const response = await axios.get("/api/user", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                const userData = response.data.user;
                console.log("Fetched user data context: ", userData); // Debugging: Log fetched user data
                setUser(userData);
            } catch (error) {
                console.error("Failed to fetch user context", error);
            }
        }
        // Only fetch user if session is authenticated and token exists
        if (status === "authenticated" && token) {
            fetchUser();
        }
    }, [status, token]);

    return (
        <UserContext.Provider value={{ user, setUser }}>
            {children}
        </UserContext.Provider>
    );
};
