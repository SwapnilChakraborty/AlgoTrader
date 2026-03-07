import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import bcrypt from "bcrypt";
import { adminDb } from "@/lib/firebase/admin";

export const authOptions: NextAuthOptions = {
    session: {
        strategy: "jwt",
    },
    pages: {
        signIn: "/login",
        error: "/login"
    },
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID || "",
            clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
        }),
        CredentialsProvider({
            name: "Sign in",
            credentials: {
                email: { label: "Email", type: "email", placeholder: "hello@example.com" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials.password) {
                    return null;
                }

                const userSnapshot = await adminDb
                    .collection("users")
                    .where("email", "==", credentials.email)
                    .limit(1)
                    .get();

                if (userSnapshot.empty) {
                    return null;
                }

                const userDoc = userSnapshot.docs[0];
                const user = { id: userDoc.id, ...userDoc.data() } as any;

                const isPasswordValid = await bcrypt.compare(credentials.password, user.passwordHash);

                if (!isPasswordValid) {
                    return null;
                }

                return {
                    id: user.id,
                    email: user.email,
                    role: user.role,
                    name: user.name
                };
            },
        }),
    ],
    callbacks: {
        async signIn({ user, account, profile }) {
            // If Google Sign-in
            if (account && account.provider === "google") {
                try {
                    if (!user.email) return false;

                    // Check if user exists in Firebase based on Google Email
                    const userSnapshot = await adminDb
                        .collection("users")
                        .where("email", "==", user.email)
                        .limit(1)
                        .get();

                    if (userSnapshot.empty) {
                        // User doesn't exist, create them as a standard USER (Trader)
                        const newUserRef = await adminDb.collection("users").add({
                            email: user.email,
                            name: user.name || "",
                            role: "USER",
                            provider: "google",
                            createdAt: new Date(),
                        });

                        // Attach generated Firebase ID and role to the NextAuth user object
                        user.id = newUserRef.id;
                        (user as any).role = "USER";
                    } else {
                        // User exists, grab their existing Firestore ID and Role
                        const userDoc = userSnapshot.docs[0];
                        const existingData = userDoc.data();
                        user.id = userDoc.id;
                        (user as any).role = existingData.role || "USER";
                    }

                    return true;
                } catch (error) {
                    console.error("Error during Google sign-in sync:", error);
                    return false;
                }
            }

            // Ensure standard credential login is allowed
            return true;
        },
        async session({ session, token }) {
            if (token) {
                session.user = {
                    ...session.user,
                    id: token.id as string,
                    role: token.role as string,
                };
            }
            return session;
        },
        async jwt({ token, user, account }) {
            // Initial sign in
            if (user) {
                token.id = user.id;
                token.role = (user as any).role;

                // For Google Provider, ensure we explicitly maintain their generated role
                if (account?.provider === 'google' && !token.role) {
                    token.role = (user as any).role || "USER";
                }
            }
            return token;
        },
    },
};
