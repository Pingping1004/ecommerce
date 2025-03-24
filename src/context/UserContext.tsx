"use client";

async function fetchUser(email: string) {
    try {
        const res = await fetch(`/api/users?email=${email}`);
        const data = await res.json();
        console.log(data);
    } catch (error) {
        console.log('Failed to fetch user data:', error)
    }
}