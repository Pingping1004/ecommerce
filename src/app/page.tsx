"use client";

// Conditional page rendering based on authentication status
import FeedPage from "@/components/Feed/Feed";
import PublicFeed from "@/components/Feed/Public";

// Context
import { useProductContext } from "@/context/ProductContext";

//Hooks
import { useAuth } from "@/hooks/useAuth";

export default function HomePage() {
    const { isLoggedIn, isLoading, logout } = useAuth();
    const productContext = useProductContext();

    console.log('Auth state: ', isLoggedIn);
    console.log('Loading state: ', isLoading);

    if (isLoggedIn) {
        if (productContext?.error) {
            return <div>Error loading products: {productContext.error}</div>;
        }
        return <FeedPage />;
    }

    return <PublicFeed />;
}
