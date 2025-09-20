import connectDB from "@/util/database";
import { NextResponse } from "next/server";

// POST 핸들러 (App Router 방식)
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get("page")) || 1;
  const limit = parseInt(searchParams.get("limit")) || 5;
  const skip = (page - 1) * limit;
  const db = (await connectDB).db("chugo");
  const item = await db
    .collection("cs")
    .find()
    .sort({ _id: -1 })
    .skip(skip)
    .limit(limit)
    .toArray();
  const data = item.map((p) => ({
    ...p,
    date: new Date(p.date).toLocaleString("ko-KR", {
      year: "2-digit",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    }),
  }));
  const totalWrite = await db.collection("cs").countDocuments();
  const totalPages = parseInt(totalWrite / 3);

  try {
    return NextResponse.json(
      {
        message: "cs 목록 조회 성공",
        data: data,
        totalPages: totalPages,
        totalWrite: totalWrite,
      },
      { status: 200 }
    );
  } catch (err) {
    console.error("cs 목록 조회 실패", err);
    return new Response(JSON.stringify({ error: "서버 오류 발생" }), {
      status: 500,
    });
  }
}
