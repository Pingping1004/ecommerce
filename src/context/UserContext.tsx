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
import { AuthContext } from "./AuthContext";

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
    const { isLoggedIn } = useContext(AuthContext);
    const { data: session } = useSession();
    const [user, setUser] = useState<UserType | null>(null);

    useEffect(() => {
        console.log("UserContext useEffect: session=", session, "status=", status);
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
