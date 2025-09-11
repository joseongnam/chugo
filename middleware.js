import { NextResponse } from 'next/server';

export function middleware(request) {
  const logMessage = `[${new Date().toISOString()}] ${request.method} ${request.url}`;
  console.log(logMessage);

  return NextResponse.next();
}