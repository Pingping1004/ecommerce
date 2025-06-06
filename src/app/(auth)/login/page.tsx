"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import Link from "next/link";

export default function LoginPage() {
    const [form, setForm] = useState({ email: "", password: "" });
    const router = useRouter();

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setForm({ ...form, [event.target.name]: event.target.value });
    };

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        console.log("Login form data:", form.email); // Debugging: log form data

        if (!form.password) {
            alert("Password is required");
            return;
        }

        const result = await signIn("credentials", {
            redirect: false,
            email: form.email,
            password: form.password,
            callbackUrl: "/dashboard",
        });

        if (result?.error) {
            alert(result.error || "Login failed");
        } else {
            router.push(result?.url || "/dashboard");
        }
    };

    const handleGoogleLogin = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault(); // Prevent form submission
        signIn("google", { callbackUrl: "/dashboard" });
    };

    return (
        <>
            <div className="container flex flex-col items-center mx-auto justify-center w-screen h-screen">
                <div className="flex justify-center items-center w-full h-full xl:gap-14 lg:justify-normal md:gap-5 draggable">
                    <div className="flex items-center justify-center w-full lg:p-12">
                        <div className="flex items-center xl:p-10">
                            <form
                                onSubmit={handleSubmit}
                                className="flex flex-col w-full h-full p-20 pb-6 text-center bg-white rounded-3xl"
                            >
                                <h3 className="mb-3 text-4xl font-extrabold text-gray-900">
                                    Already Register?
                                </h3>
                                <p className="mb-16 text-gray-700">
                                    Enter your email and password
                                </p>
                                <button
                                    type="button" // Prevent form submission
                                    className="w-full px-6 py-5 mb-10 text-sm font-medium leading-none text-white transition duration-500 md:w-96 rounded-2xl bg-gray-400 hover:bg-gray-500 hover:cursor-pointer focus:ring-4 focus:ring-purple-blue-100 bg-purple-blue-500"
                                    onClick={handleGoogleLogin}
                                >
                                    Sign In with Google
                                </button>
                                <div className="flex items-center mb-3">
                                    <hr className="h-0 border-b border-solid border-gray-500 grow" />
                                    <p className="mx-4 text-gray-600">or</p>
                                    <hr className="h-0 border-b border-solid border-gray-500 grow" />
                                </div>
                                <label
                                    htmlFor="email"
                                    className="mb-2 text-sm text-start text-gray-900 font-[500]"
                                >
                                    Email
                                </label>
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    placeholder="Enter your email"
                                    onChange={handleChange}
                                    value={form.email}
                                    required
                                    className="flex items-center w-full px-5 py-4 mr-2 text-sm font-medium outline-none mb-7 placeholder:text-gray-400 bg-gray-100 text-gray-900 rounded-2xl"
                                />
                                <label
                                    htmlFor="password"
                                    className="mb-2 text-sm text-start text-gray-900 font-[500]"
                                >
                                    Password
                                </label>
                                <input
                                    id="password"
                                    type="password"
                                    name="password"
                                    placeholder="Enter password"
                                    onChange={handleChange}
                                    value={form.password}
                                    required
                                    className="flex items-center w-full px-5 py-4 mb-5 mr-2 text-sm font-medium outline-none placeholder:text-gray-400 bg-gray-100 text-gray-900 rounded-2xl"
                                />
                                <div className="flex flex-row justify-end mb-8">
                                    <a
                                        href="#"
                                        className="mr-4 text-sm font-medium text-gray-700"
                                    >
                                        Forget password?
                                    </a>
                                </div>
                                <div className="flex justify-center">
                                    <button className="w-full px-6 py-5 mb-10 text-md font-bold leading-none text-white transition duration-500 md:w-96 rounded-2xl bg-gray-700 hover:bg-gray-800 hover:cursor-pointer focus:ring-4 focus:ring-purple-blue-100 bg-purple-blue-500">
                                        Sign In
                                    </button>
                                </div>
                                <p className="text-sm leading-relaxed text-gray-900">
                                    Not registered yet?{" "}
                                    <Link
                                        href="/signup"
                                        className="font-[700] text-blue-400 transition duration-500 hover:text-blue-600"
                                    >
                                        Create an Account
                                    </Link>
                                </p>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
