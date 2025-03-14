import React from "react";
import PrimaryButton from "../../components/ui/button/Primary";
import SecondaryButton from "../../components/ui/button/Secondary";

export default function SignupPage() {
    return (
        <>
            <div className="container flex flex-col items-center mx-auto justify-center w-screen h-screen">
                <div className="flex justify-center items-center w-full h-full xl:gap-14 lg:justify-normal md:gap-5 draggable">
                    <div className="flex items-center justify-center w-full lg:p-12">
                        <div className="flex items-center xl:p-10">
                            <form className="flex flex-col w-full h-full p-20 pb-6 text-center bg-white rounded-3xl">
                                <h3 className="mb-3 text-4xl font-extrabold text-gray-900">
                                    First Time Here?
                                </h3>
                                <p className="mb-16 text-gray-700">
                                    Enter your email and password
                                </p>
                                <SecondaryButton>
                                    Sign up with Google
                                </SecondaryButton>
                                <div className="flex items-center mb-3">
                                    <hr className="h-0 border-b border-solid border-gray-500 grow" />
                                    <p className="mx-4 text-gray-600">or</p>
                                    <hr className="h-0 border-b border-solid border-gray-500 grow" />
                                </div>
                                <label
                                    htmlFor="email"
                                    className="mb-2 text-sm text-start text-gray-900 font-[500]"
                                >
                                    Username/Email*
                                </label>
                                <input
                                    id="email"
                                    type="text/email"
                                    placeholder="Enter your email/username"
                                    className="flex items-center w-full px-5 py-4 mr-2 text-sm font-medium outline-none mb-7 placeholder:text-gray-400 bg-gray-100 text-gray-900 rounded-2xl"
                                />
                                <label
                                    htmlFor="password"
                                    className="mb-2 text-sm text-start text-gray-900 font-[500]"
                                >
                                    Password*
                                </label>
                                <input
                                    id="password"
                                    type="password"
                                    placeholder="Enter password"
                                    className="flex items-center w-full px-5 py-4 mb-12 mr-2 text-sm font-medium outline-none placeholder:text-gray-400 bg-gray-100 text-gray-900 rounded-2xl"
                                />
                                <div className="flex justify-center">
                                    <PrimaryButton>
                                        Create Account
                                    </PrimaryButton>
                                </div>
                                <p className="text-sm leading-relaxed text-gray-900">
                                    Already have an account?{" "}
                                    <a
                                        href="#"
                                        className="font-[700] text-blue-400 transition duration-500 hover:text-blue-600"
                                    >
                                        Login to your account
                                    </a>
                                </p>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
