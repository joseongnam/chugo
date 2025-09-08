import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export async function POST() {
  const res = NextResponse.json({ message: "로그아웃 성공" });
  res.cookies.set("token", "", { httpOnly: true, path: "/", maxAge: 0 });
  return res;
}