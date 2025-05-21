import { NextRequest, NextResponse } from "next/server";
import { getVerificationToken, deleteVerificationToken, getUserByEmail, updateUser } from "@/lib/supabase";

export async function GET(req: NextRequest) {
  try {
    const token = req.nextUrl.searchParams.get("token");
    
    if (!token) {
      return NextResponse.json(
        { error: "Missing token" },
        { status: 400 }
      );
    }
    
    // Get token from database
    const verificationToken = await getVerificationToken(token);
    
    if (!verificationToken) {
      return NextResponse.json(
        { error: "Invalid token" },
        { status: 400 }
      );
    }
    
    // Check if token has expired
    if (new Date(verificationToken.expires) < new Date()) {
      await deleteVerificationToken(token);
      return NextResponse.json(
        { error: "Token has expired" },
        { status: 400 }
      );
    }
    
    // Get user by email
    const user = await getUserByEmail(verificationToken.email);
    
    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }
    
    // Update user's email_verified status
    await updateUser(user.id, { email_verified: true });
    
    // Delete token
    await deleteVerificationToken(token);
    
    // Redirect to login page with success message
    const locale = req.nextUrl.searchParams.get("locale") || "en-GB";
    return NextResponse.redirect(
      new URL(`/${locale}/auth/login?verified=true`, req.url)
    );
  } catch (error) {
    console.error("Email verification error:", error);
    return NextResponse.json(
      { error: "An error occurred during email verification" },
      { status: 500 }
    );
  }
}
