import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";

export async function middleware(request) {
  const logMessage = `[${new Date().toISOString()}] ${request.method} ${
    request.url
  }`;
  console.log(logMessage);

  const token = await getToken({ req: request });
  console.log("TOKEN:", token);

  if (!token || token.isAdmin !== "true") {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admindashboard/:path*"],
};
