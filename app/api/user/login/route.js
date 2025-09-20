import connectDB from "@/util/database";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";

// POST 핸들러 (App Router 방식)
export async function POST(request) {
  const { identifier, password } = await request.json();
  const db = (await connectDB).db("chugo");
  const user = await db
    .collection("user")
    .findOne({ $or: [{ email: identifier }, { id: identifier }] });
  const isMatch = await bcrypt.compare(password, user.password);

  try {
    if (!user) {
      return new Response(
        JSON.stringify({ error: "사용자를 찾을 수 없습니다." }),
        {
          status: 400,
        }
      );
    }
    if (user && !isMatch) {
      return new Response(JSON.stringify({ error: "비밀번호 불일치" }), {
        status: 400,
      });
    }

    if (user && isMatch) {
      const token = jwt.sign(
        {
          id: user.id,
          email: user.email,
          name: user.name,
          isAdmin: user.isAdmin,
        },
        process.env.JWT_SECRET, // 환경 변수에 꼭 저장!
        {
          expiresIn: "1d", // 7일간 유지
        }
      );
      const response = NextResponse.json({
        message: "로그인 성공",
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          isAdmin: user.isAdmin,
        },
      });
      response.cookies.set({
        name: "token",
        value: token,
        httpOnly: true, // JavaScript에서 접근 불가
        //process.env.NODE_ENV === "production",//
        secure: false,
        sameSite: "lax", //sameSite: "strict" 실제배포시
        maxAge: 60 * 60, // 1시간
        path: "/",
      });

      return response;
    }
  } catch (err) {
    console.error("로그인 실패", err);
    return new Response(JSON.stringify({ error: "서버 오류 발생" }), {
      status: 500,
    });
  }
}
