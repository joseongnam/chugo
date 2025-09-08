import connectDB from "@/util/database";
import bcrypt from "bcrypt";

export const dynamic = "force-dynamic";
// POST 핸들러 (App Router 방식)
export async function POST(request) {
  const {
    id,
    email,
    password,
    repassword,
    name,
    phoneNumber,
    yymmdd,
    zipcode,
    address,
  } = await request.json();
  const hashedPw = await bcrypt.hash(password, 10);
  const db = (await connectDB).db("chugo");
  const existingUser = await db
    .collection("user")
    .findOne({ $or: [{ id: id }, { email: email }, { phone: phoneNumber }] });

  try {
    if (
      !id ||
      !password ||
      !repassword ||
      !email ||
      !name ||
      !phoneNumber ||
      !yymmdd ||
      !zipcode ||
      !address
    ) {
      return new Response(JSON.stringify({ error: "입력값 부족" }), {
        status: 400,
      });
    }
    if (password !== repassword) {
      return new Response(JSON.stringify({ error: "비밀번호 불일치" }), {
        status: 400,
      });
    }

    if (existingUser) {
      return new Response(
        JSON.stringify({ error: "이미 존재하는 사용자입니다." }),
        {
          status: 400,
        }
      );
    }

    const result = await db.collection("user").insertOne({
      id: id,
      password: hashedPw,
      email: email,
      name: name,
      phone: phoneNumber,
      yymmdd: yymmdd,
      zipcode: zipcode,
      address: address,
      isAdmin: "false",
      createdAt: new Date(),
    });

    return new Response(
      JSON.stringify({ message: "가입 완료", redirect: "/login" }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (err) {
    console.error("가입 실패", err);
    return new Response(JSON.stringify({ error: "서버 오류 발생" }), {
      status: 500,
    });
  }
}
