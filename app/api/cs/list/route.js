import { NextResponse } from "next/server";
import connectDB from "@/util/database";


// POST 핸들러 (App Router 방식)
export async function GET(request) {
  const db = (await connectDB).db("chugo");
  const data = await db
    .collection("cs")
    .find().toArray();

  try {
    return NextResponse.json(
      { message: "cs 목록 조회 성공", data : data },
      { status: 200 }
    );
  } catch (err) {
    console.error("cs 목록 조회 실패", err);
    return new Response(JSON.stringify({ error: "서버 오류 발생" }), {
      status: 500,
    });
  }
}