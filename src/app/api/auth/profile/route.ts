import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { hash, compare } from "bcryptjs";
import { auth } from "@/auth";
import { getUserById, updateUser } from "@/lib/supabase";

export const dynamic = 'force-dynamic';

// Validation schema for profile update
const updateProfileSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").optional(),
  image: z.string().url("Invalid image URL").optional(),
  currentPassword: z.string().optional(),
  newPassword: z.string().min(8, "Password must be at least 8 characters").optional(),
});

export async function GET(req: NextRequest) {
  try {
    // Get current session
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Get user from database
    const user = await getUserById(session.user.id);

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    // Return user profile (excluding sensitive information)
    return NextResponse.json({
      id: user.id,
      name: user.name,
      email: user.email,
      image: user.image,
      emailVerified: user.email_verified,
      provider: user.provider,
      createdAt: user.created_at,
    });
  } catch (error) {
    console.error("Get profile error:", error);
    return NextResponse.json(
      { error: "An error occurred while fetching your profile" },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    // Get current session
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await req.json();

    // Validate input
    const result = updateProfileSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { error: "Invalid input", details: result.error.format() },
        { status: 400 }
      );
    }

    const { name, image, currentPassword, newPassword } = result.data;

    // Get user from database
    const user = await getUserById(session.user.id);

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    // Update object
    const updateData: any = {};

    // Update name if provided
    if (name) {
      updateData.name = name;
    }

    // Update image if provided
    if (image) {
      updateData.image = image;
    }

    // Update password if provided
    if (currentPassword && newPassword) {
      // Verify current password
      const isPasswordValid = await compare(currentPassword, user.password);

      if (!isPasswordValid) {
        return NextResponse.json(
          { error: "Current password is incorrect" },
          { status: 400 }
        );
      }

      // Hash new password
      updateData.password = await hash(newPassword, 12);
    }

    // Only update if there are changes
    if (Object.keys(updateData).length === 0) {
      return NextResponse.json(
        { error: "No changes to update" },
        { status: 400 }
      );
    }

    // Update user
    await updateUser(user.id, updateData);

    return NextResponse.json(
      {
        success: true,
        message: "Profile updated successfully"
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Update profile error:", error);
    return NextResponse.json(
      { error: "An error occurred while updating your profile" },
      { status: 500 }
    );
  }
}
