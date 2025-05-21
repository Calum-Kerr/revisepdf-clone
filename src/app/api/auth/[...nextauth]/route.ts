import { handlers } from "@/auth";

export const dynamic = 'force-dynamic';

// Export the NextAuth.js API route handlers
export const { GET, POST } = handlers;
