import NextAuth, { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import FacebookProvider from "next-auth/providers/facebook";
import CredentialsProvider from "next-auth/providers/credentials";
import { connectToDatabase } from "@/lib/database";
import User from "@/models/User";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

declare module "next-auth" {
    interface AdapterUser {
        role?: string;
    }
    interface User {
        role?: string;
    }

    interface Session {
        user?: {
            username?: string | null;
            email?: string | null;
            image?: string | null;
            role?: string;
        };
    }
}

export const authOptions: NextAuthOptions = {
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID || "",
            clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
            authorization: {
                params: {
                    prompt: "consent",
                    access_type: "offline",
                    response_type: "code",
                },
            },
        }),

        FacebookProvider({
            clientId: process.env.FACEBOOK_CLIENT_ID || "",
            clientSecret: process.env.FACEBOOK_CLIENT_SECRET || "",
            authorization: {
              params: {
                scope: 'email public_profile',
              }
            }
        }),

        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" },
            },

            async authorize(credentials) {
                if (!credentials) throw new Error("Credentials are missing");

                await connectToDatabase();
                const user = (await User.findOne({
                    $or: [
                        { email: credentials.email },
                        { username: credentials.email },
                    ],
                })) as {
                    _id: string;
                    username: string;
                    email: string;
                    password?: string;
                    role?: string;
                } | null;

                // 🔹 Check if user signed up via OAuth (Google, Facebook)
                if (!user || !user.password) {
                    throw new Error(
                        "This email is registered via Google or Facebook. Please log in with that provider."
                    );
                }

                const isValid = await bcrypt.compare(
                    credentials.password,
                    user.password
                );

                if (!isValid) throw new Error("Invalid credentials");

                return {
                    id: user._id.toString(),
                    name: user.username,
                    email: user.email,
                    role: user.role,
                };
            },
        }),
    ],

    callbacks: {
        async jwt({ token, user, account }) {
            console.log("JWT Callback: ", { token, user, account });
            if (user) {
                token.role = user.role || "user";
                token.user = user;
            }

            // If OAuth login, manually generate a JWT and attach it to the token
            if (
                account?.provider === "google" ||
                account?.provider === "facebook"
            ) {
                const secret = process.env.NEXTAUTH_SECRET || '';
                const generatedToken = jwt.sign(
                    { email: token.email, role: token.role },
                    secret,
                    { expiresIn: "7d" }
                );

                token.accessToken = generatedToken;
                token.provider = account.provider;
            }
            return token;
        },
        async session({ session, token }) {
            console.log("Session Callback: ", { session, token });
            if (session?.user) {
                session.user.role = token.role as string | undefined;
                session.user = token.user as {
                    username?: string | null | undefined;
                    email?: string | null | undefined;
                    image?: string | null | undefined;
                    role?: string | undefined;
                };
            }

            return session;
        },
        
        async signIn({ account, profile }) {
            console.log("OAuth SignIn Callback: ", { account, profile });

            if (
                account?.provider === "google" ||
                account?.provider === "facebook"
            ) {
                // More detailed logging here
                console.log("OAuth Account: ", account);
                console.log("OAuth Profile: ", profile);

                await connectToDatabase();

                const email = profile?.email;
                const username = email?.split("@")[0]; // Derive username from email
                const role = "buyer"; // Default role for OAuth users

                if (!email) {
                    console.error("Email is missing from the profile");
                    return false;
                }

                // Check if the user already exists in the database
                const existingUser = await User.findOne({ email });
                if (!existingUser) {
                    // Save the new user to the database
                    const newUser = new User({
                        email,
                        username,
                        role,
                        providers: [account.provider],
                        // Do not include password for OAuth users
                    });

                    await newUser.save();
                    console.log("New user created:", newUser);
                }
            }

            return true; // Allow sign-in for other providers
        },
        async redirect({ url, baseUrl }) {
            console.log("Redirect URL:", url);
            // If the OAuth callback is triggering redirection, send the user to /dashboard
            if (url.includes("/api/auth/callback")) {
                return `${baseUrl}/dashboard`;
            }
            // If coming from /login or /signup, force dashboard
            if (url.startsWith(`${baseUrl}/login`) || url.startsWith(`${baseUrl}/signup`)) {
                return `${baseUrl}/dashboard`;
            }
            if (url.startsWith(baseUrl)) {
                return url;
            }
            return `${baseUrl}/dashboard`;
        },
    },

    session: {
        strategy: "jwt",
    },

    secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
