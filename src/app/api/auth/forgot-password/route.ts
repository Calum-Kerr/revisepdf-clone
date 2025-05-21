import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getUserByEmail } from "@/lib/supabase";
import { sendPasswordResetEmail } from "@/lib/supabase-email";

export const dynamic = 'force-dynamic';

// Validation schema for forgot password
const forgotPasswordSchema = z.object({
  email: z.string().email("Invalid email address"),
  locale: z.string().default("en-GB"),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Validate input
    const result = forgotPasswordSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { error: "Invalid input", details: result.error.format() },
        { status: 400 }
      );
    }

    const { email, locale } = result.data;

    // Check if user exists
    const user = await getUserByEmail(email);

    // Always return success even if user doesn't exist for security reasons
    if (!user) {
      return NextResponse.json(
        {
          success: true,
          message: "If your email is registered, you will receive a password reset link."
        },
        { status: 200 }
      );
    }

    // Send password reset email
    await sendPasswordResetEmail(email, locale);

    return NextResponse.json(
      {
        success: true,
        message: "If your email is registered, you will receive a password reset link."
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Forgot password error:", error);
    return NextResponse.json(
      { error: "An error occurred while processing your request" },
      { status: 500 }
    );
  }
}
