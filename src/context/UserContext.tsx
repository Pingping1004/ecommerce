"use client";

import {
    createContext,
    useContext,
    useState,
    useEffect,
    Dispatch,
    SetStateAction,
} from "react";
import { useSession } from "next-auth/react";
import { useAuth } from "@/hooks/useAuth";

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

const UserContext = createContext<UserContextType | null>(null);

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
    const { isLoggedIn } = useAuth();
    const { data: session, status } = useSession();
    const [user, setUser] = useState<UserType | null>(null);

    useEffect(() => {
        console.log("UserContext useEffect: ", "status=", status);
        if (isLoggedIn && session?.user) {
            setUser({
                email: session.user.email ?? "",
                username: session.user.username ?? session.user.name ?? '',
                role: session.user.role ?? "",
                image: session.user.image ?? undefined,
            });
        } else {
            setUser(null);
        }
    }, [session, isLoggedIn]);

    return (
        <UserContext.Provider value={{ user, setUser }}>
            {children}
        </UserContext.Provider>
    );
};

export default UserContext;
