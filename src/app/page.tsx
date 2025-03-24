"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function HomePage() {
    const { user, token, fetchUser } = useAuth();
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (!token) {
            router.push("/auth/login");
        } else if (!user) {
            fetchUser(token).finally(() => setIsLoading(false)); // Fetch user if not available
        } else {
            setIsLoading(false); // Stop loading when user data is available
        }
    }, [token, user, router, fetchUser]);

    useEffect(() => {
        console.log("User data:", user); // Debugging: Log user data
    }, [user]);

    if (isLoading) {
        return <div>Loading user...</div>;
    }

    return (
        <>
            <div>Welcome back, {user?.email || "Guest"}</div>
        </>
    );
}
