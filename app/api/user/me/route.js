import jwt from "jsonwebtoken";
import { getServerSession } from "next-auth/next";
import { cookies } from "next/headers";
import { authOptions } from "../../auth/[...nextauth]/route.js";

const SECRET_KEY = process.env.JWT_SECRET;

export async function GET() {
  // 1) NextAuth 세션 검사
  const session = await getServerSession(authOptions);
  if (session) {
    return new Response(JSON.stringify({ user: session.user }), {
      status: 200,
    });
  }

  // 2) NextAuth 세션 없으면 기존 JWT 토큰 검사
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  if (!token) {
    return new Response(JSON.stringify({ message: "Unauthorized" }), {
      status: 401,
    });
  }

  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    return new Response(JSON.stringify({ user: decoded }), { status: 200 });
  } catch (e) {
    return new Response(JSON.stringify({ message: "Invalid token" }), {
      status: 401,
    });
  }
}
