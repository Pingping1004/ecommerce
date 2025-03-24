// "use client";

// import { createContext, useContext, useEffect, useState } from "react";
// import Cookies from "js-cookie";

// interface DecodedUser {
//     id: string;
//     email: string;
// }

// interface AuthContextType {
//     user: DecodedUser | null;
//     setUser: React.Dispatch<React.SetStateAction<DecodedUser | null>>;
//     token: string | null;
//     setToken: (token: string | null) => void;
//     fetchUser: (token: string) => Promise<void>; // Expose fetchUser
// }

// const AuthContext = createContext<AuthContextType | null>(null);

// export function AuthProvider({ children }: { children: React.ReactNode }) {
//     const [user, setUser] = useState<DecodedUser | null>(null);
//     const [token, setToken] = useState<string | null>(null);

//     useEffect(() => {
//         const savedToken = Cookies.get("token");
//         if (savedToken) {
//             setToken(savedToken);
//             fetchUser(savedToken);
//         }
//     }, []);

//     const fetchUser = async (token: string) => {
//         try {
//             console.log("Using token for fetchUser:", token); // Debugging: Log token being used
//             const res = await fetch("/api/user/profile", {
//                 method: "GET",
//                 headers: {
//                     Authorization: `Bearer ${token}`,
//                 },
//             });

//             if (!res.ok) {
//                 const errorData = await res.json();
//                 console.error(
//                     "Error fetching user:",
//                     errorData.message || "Unknown error"
//                 );
//                 setUser(null);
//                 return;
//             }

//             const data = await res.json();
//             console.log("Fetched user data:", data.user); // Debugging: Log fetched user data
//             setUser(data.user);
//         } catch (error) {
//             console.error("Error fetching user:", error);
//             setUser(null);
//         }
//     };

//     const login = async (email: string, password: string) => {
//         if (!password) {
//             console.error("Password is required"); // Debugging: Log missing password
//             alert("Password is required");
//             return;
//         }

//         console.log("Login request data:", { email, password }); // Debugging: Log login request data

//         const response = await fetch("/api/auth/login", {
//             method: "POST",
//             body: JSON.stringify({ email, password }),
//             headers: { "Content-Type": "application/json" },
//         });

//         const data = await response.json();
//         if (response.ok && data.token) {
//             Cookies.set("token", data.token, { expires: 1 });
//             setToken(data.token);
//             await fetchUser(data.token); // Fetch user after login
//         } else {
//             console.error("Login failed:", data.message);
//             alert(data.error || "Login failed");
//         }
//     };

//     const signup = async (email: string, password: string) => {
//         const response = await fetch("/api/auth/signup", {
//             method: "POST",
//             body: JSON.stringify({ email, password }),
//             headers: { "Content-Type": "application/json" },
//         });

//         const data = await response.json();
//         if (response.ok && data.token) {
//             console.log("Signup successful, token:", data.token); // Debugging: Log token
//             Cookies.set("token", data.token, { expires: 1 });
//             setToken(data.token);
//             await fetchUser(data.token); // Fetch user after signup
//         } else {
//             console.error("Signup failed:", data.error || "Unknown error");
//         }
//     };

//     const logout = () => {
//         Cookies.remove("token");
//         setToken(null);
//         setUser(null);
//     };

//     return (
//         <AuthContext.Provider
//             value={{ user, setUser, token, setToken, fetchUser }}
//         >
//             {children}
//         </AuthContext.Provider>
//     );
// }

// export const useAuth = (): AuthContextType => {
//     const context = useContext(AuthContext);
//     if (!context) {
//         throw new Error("useAuth must be used within an Auth Provider");
//     }

//     return context;
// };
