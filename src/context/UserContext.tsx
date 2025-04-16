"use client";

import {
    createContext,
    useState,
    useEffect,
    Dispatch,
    SetStateAction,
} from "react";
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
    const { data: session, status } = useSession();
    const [user, setUser] = useState<UserType | null>(null);

    useEffect(() => {
        console.log("UserContext useEffect: session=", session, "status=", status);
        if (status === "authenticated" && session?.user) {
            setUser({
                email: session.user.email ?? "",
                username: session.user.username ?? "",
                role: session.user.role ?? "",
                image: session.user.image ?? undefined,
            });
        } else {
            setUser(null);
        }
    }, [session, status]);

    return (
        <UserContext.Provider value={{ user, setUser }}>
            {children}
        </UserContext.Provider>
    );
};
