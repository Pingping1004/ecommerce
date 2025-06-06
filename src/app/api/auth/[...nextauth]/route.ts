import NextAuth, { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import FacebookProvider from "next-auth/providers/facebook";
import CredentialsProvider from "next-auth/providers/credentials";
import { connectToDatabase } from "@/lib/database";
import User from "@/models/User";
import bcrypt from "bcryptjs";
import { signToken } from "@/lib/jwt";

declare module "next-auth" {
    interface User {
        role?: string;
        username?: string;
    }

    interface Session {
        user?: {
            id?: string;
            name?: string | null;
            username?: string | null;
            email?: string | null;
            image?: string | null;
            role?: string;
        };
        accessToken?: string;
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
                    image?: string;
                } | null;

                // 🔹 Check if user signed up via OAuth (Google, Facebook)
                if (!user || !user.password) {
                    throw new Error(
                        "This email is registered via Google. Please log in with that provider."
                    );
                }

                const isValid = await bcrypt.compare(
                    credentials.password,
                    user.password
                );

                if (!isValid) throw new Error("Invalid credentials");

                return {
                    id: user._id.toString(),
                    username: user.username, // Ensure this exists in DB
                    email: user.email,
                    role: user.role || "buyer",
                    image: user.image,
                };
            },
        }),
    ],

    callbacks: {
        async jwt({ token, user, account }) {
            console.log("JWT Callback:", { token, user, account });
            // When a new user signs in, add additional fields
            if (user) {
                token.email = user.email;
                token.username =
                    user.username ||
                    (user?.email ? user.email.split("@")[0] : null); // fallback
                token.role = user.role || "buyer";
                token.id = user.id;

                token.accessToken = await signToken({
                    id: user.id,
                    email: user.email,
                    role: user.role || "buyer",
                });
            }
            // For OAuth logins, add accessToken if needed.
            if (account?.provider === "google") {
                const secret = process.env.NEXTAUTH_SECRET || "";
                const generatedToken = signToken({
                    email: token.email,
                    role: token.role,
                });
                token.accessToken = generatedToken;
                token.provider = account.provider;
            }
            return token;
        },

        async session({ session, token }) {
            console.log("Session Callback:", { session, token });
            if (session?.user) {
                session.user.id = token.id as string || token.sub as string;
                session.user.email = token.email as string;
                session.user.username = token.username as string;
                session.user.role = token.role as string;
                session.accessToken = token.accessToken as string;
            }

            console.log("Session callback result:", session);
            return session;
        },

        async signIn({ account, profile }) {
            console.log("OAuth SignIn Callback: ", { account, profile });

            if (account?.provider === "google") {
                // More detailed logging here
                console.log("OAuth Account: ", account);
                console.log("OAuth Profile: ", profile);

                await connectToDatabase();

                const email = profile?.email;
                const username = email?.split("@")[0]; // Derive username from email
                const role = "buyer"; // Default role for OAuth users
                const image = profile?.image;

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
                        image,
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
            const parsedUrl = new URL(url, baseUrl);
            const tokenParam = parsedUrl.searchParams.get("token");
            if (tokenParam) {
                return `${baseUrl}/?token=${tokenParam}`;
            }
            if (url.includes("/api/auth/callback")) {
                return `${baseUrl}/`;
            }
            if (
                url.startsWith(`${baseUrl}/login`) ||
                url.startsWith(`${baseUrl}/signup`)
            ) {
                return `${baseUrl}/`;
            }
            if (url.startsWith(baseUrl)) {
                return url;
            }
            return `${baseUrl}/`;
        },
    },

    session: {
        strategy: "jwt",
    },

    secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
