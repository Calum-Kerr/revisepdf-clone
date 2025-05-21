import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const session = await auth();
  return NextResponse.json(session);
}
