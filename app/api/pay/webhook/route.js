import { NextResponse } from "next/server";

export async function POST(req) {
  const data = await req.json();

  console.log("Webhook data:", data);
  // 여기서 data.imp_uid로 결제내역 조회 → DB 업데이트
  // 포트원은 imp_uid랑 상태(status)만 주기 때문에, 반드시 API로 검증 필요

  return NextResponse.json({ received: true });
}
