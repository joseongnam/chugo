import connectDB from "@/util/database";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export async function GET(request) {
  try {
    const db = (await connectDB).db("chugo");
    const result = await db.collection("products").find().toArray();

    return NextResponse.json(
      { message: "상품 목록 조회 완료", products: result },
      {
        status: 200,
      }
    );
  } catch (err) {
    console.error("조회 실패", err);
    return NextResponse.json({ error: "서버 오류 발생" }, { status: 500 });
  }
}
