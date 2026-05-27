import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET() {
  const cookieStore = await cookies();
  const session = cookieStore.get("auth_session");
  
  if (!session) {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }
  
  // session.value format is `session_${username}_${timestamp}`
  const parts = session.value.split('_');
  const username = parts.length >= 2 ? parts[1] : 'user';

  return NextResponse.json({ authenticated: true, username });
}
