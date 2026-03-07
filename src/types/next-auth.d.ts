import { DefaultSession } from "next-auth";

declare module "next-auth" {
    interface Session {
        user: {
            id: string;
            role: "USER" | "VENDOR" | "ADMIN" | "PENDING_VENDOR";
        } & DefaultSession["user"];
    }

    interface User {
        id: string;
        role: "USER" | "VENDOR" | "ADMIN" | "PENDING_VENDOR";
    }
}

declare module "next-auth/jwt" {
    interface JWT {
        id: string;
        role: "USER" | "VENDOR" | "ADMIN" | "PENDING_VENDOR";
    }
}
