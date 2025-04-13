"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSession } from "next-auth/react";
import type { User as UserModel } from "@/models/User";
import { useRouter } from "next/navigation";
import { logoutUser } from "@/features/auth/authService";

type UserType = Pick<UserModel, 'username' | 'email' | 'role'>;

export default function DashboardPage() {
    const [user, setUser] = useState<UserType | null>(null);
    const { data: session, status } = useSession();
    const token = session?.accessToken;
    const router = useRouter();

    const logout = async () => {
        try {
            await logoutUser();
            router.push('/login');
        } catch (error) {
            console.error('Logout failed', error);
        }
    }

    useEffect(() => {
        if (status === 'loading') return;
        if (status === 'unauthenticated') return router.push('/login');

        async function fetchUser() {
            try {
                const response = await axios.get('/api/user', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    }
                });

                const userData: UserType = response.data.user;
                console.log('Fetching user data: ', userData);
                setUser(userData);
            } catch (error) {
                console.error('Failed to get user data', error);
            }
        }
        fetchUser();
    }, [status, router]);

    if (status === 'loading') return <p>Loading user data...</p>

    return (
      <div>
          <h1>Dashboard Page</h1>
          {user ? (
            <>
                <p>Username: {user?.username}</p>
                <p>Role: {user?.role}</p>
                <button 
                    className="p-2 bg-white text-primary cursor-pointer"
                    onClick={logout}
                >
                    Logout
                </button>
            </>
          ): (
            <p>Loading user data...</p>
          )}
      </div>
    )
}
