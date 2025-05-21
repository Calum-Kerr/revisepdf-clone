import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { hash } from "bcryptjs";
import { getPasswordResetToken, deletePasswordResetToken, getUserByEmail, updateUser } from "@/lib/supabase";

export const dynamic = 'force-dynamic';

// Validation schema for reset password
const resetPasswordSchema = z.object({
  token: z.string(),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Validate input
    const result = resetPasswordSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { error: "Invalid input", details: result.error.format() },
        { status: 400 }
      );
    }

    const { token, password } = result.data;

    // Get token from database
    const resetToken = await getPasswordResetToken(token);

    if (!resetToken) {
      return NextResponse.json(
        { error: "Invalid token" },
        { status: 400 }
      );
    }

    // Check if token has expired
    if (new Date(resetToken.expires) < new Date()) {
      await deletePasswordResetToken(token);
      return NextResponse.json(
        { error: "Token has expired" },
        { status: 400 }
      );
    }

    // Get user by email
    const user = await getUserByEmail(resetToken.email);

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    // Hash new password
    const hashedPassword = await hash(password, 12);

    // Update user's password
    await updateUser(user.id, { password: hashedPassword });

    // Delete token
    await deletePasswordResetToken(token);

    return NextResponse.json(
      {
        success: true,
        message: "Password has been reset successfully. You can now log in with your new password."
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Reset password error:", error);
    return NextResponse.json(
      { error: "An error occurred while resetting your password" },
      { status: 500 }
    );
  }
}
