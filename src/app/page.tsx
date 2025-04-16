"use client";

import React, { useEffect, useContext } from "react";
import Image from "next/image";

// Conditional page rendering based on authentication status
import FeedPage from "@/components/Feed/Feed";
import PublicFeed from "@/components/Feed/Public";

// Context
import { AuthContext } from "@/context/AuthContext";

export default function HomePage() {
    const { isLoggedIn, isLoading } = useContext(AuthContext);

    if (isLoggedIn) {
        return <FeedPage />;
    }
    
    return (
        <PublicFeed />
    );
}
