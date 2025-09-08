import { NextResponse } from "next/server";
import connectDB from "@/util/database";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const dynamic = "force-dynamic";
// POST 핸들러 (App Router 방식)
export async function GET(request) {
  const db = (await connectDB).db("chugo");
  const user = await db
    .collection("user")
    .find().toArray();

  try {
    return NextResponse.json(
      { message: "유저 목록 조회 완료", users: user },
      { status: 200 }
    );
  } catch (err) {
    console.error("유저 목록 조회 실패", err);
    return new Response(JSON.stringify({ error: "서버 오류 발생" }), {
      status: 500,
    });
  }
}
