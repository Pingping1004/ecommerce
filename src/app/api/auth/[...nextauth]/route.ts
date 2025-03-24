import NextAuth, { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import FacebookProvider from "next-auth/providers/facebook";
import CredentialsProvider from "next-auth/providers/credentials";
import { connectToDatabase } from "@/lib/database";
import User from "@/models/User";
import bcrypt from "bcryptjs";

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
      clientId: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
        },
      },
    }),

    FacebookProvider({
      clientId: process.env.FACEBOOK_CLIENT_ID || '',
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET || '',
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
        const user = await User.findOne({
          $or: [{ email: credentials.email }, { username: credentials.email }],
        }) as { _id: string; username: string; email: string; password?: string; role?: string } | null;

          // 🔹 Check if user signed up via OAuth (Google, Facebook)
        if (!user || !user.password) {
            throw new Error("This email is registered via Google or Facebook. Please log in with that provider.");
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
    async jwt({ token, user }) {
        console.log("JWT Callback: ", { token, user });
        if (user) {
        token.role = user.role || "user";
        }
        return token;
    },
    async session({ session, token }) {
        console.log("Session Callback: ", { session, token });
      if (session?.user) session.user.role = token.role as string | undefined;
      return session;
    },
    async signIn({ account, profile }) {
      console.log("OAuth SignIn Callback: ", { account, profile });

      if (account?.provider === "google" || account?.provider === "facebook") {
        // More detailed logging here
        console.log("OAuth Account: ", account);
        console.log("OAuth Profile: ", profile);
      }

      if (!account || !profile) {
        console.error("Account or profile is missing");
        return false;
      }

      if (account.provider === "google") {
        const googleProfile = profile as {
          email_verified?: boolean;
          email?: string;
        };
        if (!googleProfile.email_verified) {
          console.error("Google email is not verified");
          return false;
        }

        const allowedDomains = ["gmail.com", ".edu"];
        if (!googleProfile.email || !allowedDomains.some(domain => (googleProfile.email ?? "").endsWith(domain))) {
            console.error("Unauthorized domain");
            return false;
          }
      }

      return true; // Allow sign-in for other providers
    },
    async redirect({ url, baseUrl }) {
        console.log('Redirect URL: ', url);
      // Redirect to the requested URL if it starts with the base URL
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
