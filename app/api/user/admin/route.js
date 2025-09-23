import { getToken } from "next-auth/jwt";

const SECRET_KEY = process.env.JWT_SECRET;

export async function GET(request) {
  const token = await getToken({ req: request, secret: SECRET_KEY });
  console.log("어드민", token);

  if (!token) {
    return new Response(JSON.stringify({ message: "토큰 없음" }), {
      status: 401,
    });
  }

  try {
    const result =
      token.isAdmin === "true" || token.isAdmin === true ? true : false;

    return new Response(JSON.stringify({ result }), { status: 200 });
  } catch (err) {
    return new Response(JSON.stringify({ message: "유효하지 않은 토큰" }), {
      status: 401,
    });
  }

  // 기존방식 토큰 jsonwebtoken
  // const cookieStore = await cookies();
  // const token = cookieStore.get("token")?.value;

  // if (!token) {
  //   return new Response(JSON.stringify({ message: "토큰 없음" }), {
  //     status: 401,
  //   });
  // }

  // try {
  //   const decoded = jwt.verify(token, SECRET_KEY);
  //   // 예: 관리자 여부 boolean으로 변환
  //   const result =
  //     decoded.isAdmin === "true" || decoded.isAdmin === true ? true : false;
  //   return new Response(JSON.stringify({ result }), { status: 200 });
  // } catch (err) {
  //   return new Response(JSON.stringify({ message: "유효하지 않은 토큰" }), {
  //     status: 401,
  //   });
  // }
}
