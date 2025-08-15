import connectDB from "@/util/database";
import { NextResponse } from "next/server";

export async function GET(request) {
  try {
    const db = (await connectDB).db("chugo");
    const result = await db.collection("products").find().toArray();

    return new NextResponse.json(
      JSON.stringify({ message: "상품 목록 조회 완료", products: result }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (err) {
    console.error("조회 실패", err);
    return new Response(JSON.stringify({ error: "서버 오류 발생" }), {
      status: 500,
    });
  }
}
