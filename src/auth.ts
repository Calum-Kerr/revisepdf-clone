import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { compare } from "bcryptjs";
import { supabase } from "@/lib/supabase";
import { getLocaleFromPath } from "@/lib/auth";

/**
 * NextAuth.js v5 configuration
 * This is the new way to configure NextAuth in v5
 */
export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    // Email/Password authentication
    CredentialsProvider({
      id: "credentials",
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, req) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email and password required");
        }

        // Fetch user from Supabase
        const { data: user, error } = await supabase
          .from("users")
          .select("*")
          .eq("email", credentials.email.toLowerCase())
          .single();

        if (error || !user) {
          throw new Error("Invalid email or password");
        }

        // Verify password
        const isPasswordValid = await compare(
          credentials.password,
          user.password
        );

        if (!isPasswordValid) {
          throw new Error("Invalid email or password");
        }

        // Check if email is verified
        if (!user.email_verified) {
          throw new Error("Please verify your email before logging in");
        }

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          image: user.image,
        };
      },
    }),

    // Google OAuth authentication
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
      profile(profile) {
        return {
          id: profile.sub,
          name: profile.name,
          email: profile.email,
          image: profile.picture, // Google provides the profile picture URL
          emailVerified: true,
        };
      },
    }),
  ],
  pages: {
    signIn: (request) => {
      const locale = getLocaleFromPath(request?.url || "") || "en-GB";
      return `/${locale}/auth/login`;
    },
    signOut: (request) => {
      const locale = getLocaleFromPath(request?.url || "") || "en-GB";
      return `/${locale}/auth/signout`;
    },
    error: (request) => {
      const locale = getLocaleFromPath(request?.url || "") || "en-GB";
      return `/${locale}/auth/error`;
    },
    verifyRequest: (request) => {
      const locale = getLocaleFromPath(request?.url || "") || "en-GB";
      return `/${locale}/auth/verify-request`;
    },
    newUser: (request) => {
      const locale = getLocaleFromPath(request?.url || "") || "en-GB";
      return `/${locale}/auth/register`;
    },
  },
  callbacks: {
    async signIn({ user, account, profile }) {
      // For OAuth sign-ins, create or update the user in our database
      if (account?.provider === "google") {
        try {
          const { data: existingUser } = await supabase
            .from("users")
            .select("*")
            .eq("email", user.email)
            .single();

          if (!existingUser) {
            // Create new user
            await supabase.from("users").insert({
              id: user.id,
              name: user.name,
              email: user.email,
              image: user.image, // Store the Google profile image URL
              email_verified: true,
              provider: "google",
            });
          } else {
            // Update existing user
            await supabase
              .from("users")
              .update({
                name: user.name,
                image: user.image, // Always update with the latest Google profile image
                provider: "google",
                last_sign_in: new Date().toISOString(),
              })
              .eq("email", user.email);
          }
        } catch (error) {
          console.error("Error during OAuth sign-in:", error);
          return false;
        }
      }
      return true;
    },
    async session({ session, token }) {
      if (token.sub && session.user) {
        session.user.id = token.sub;

        // Ensure image is included in the session
        if (token.picture && !session.user.image) {
          session.user.image = token.picture as string;
        }
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.sub = user.id;

        // Store the user's image URL in the token
        if (user.image) {
          token.picture = user.image;
        }
      }
      return token;
    },
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  cookies: {
    sessionToken: {
      name: `next-auth.session-token`,
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: process.env.NODE_ENV === "production",
      },
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === "development",
});
