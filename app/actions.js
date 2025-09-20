"use server";

import connectDB from "@/util/database";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

// 게시글 생성
export async function writePost(formData) {
  const title = formData.get("title");
  const content = formData.get("content");
  const email = formData.get("email");
  const date = new Date();
  const db = (await connectDB).db("chugo");

  try {
    const result = await db
      .collection("cs")
      .insertOne({ userEmail: email, title, content: content, date: date });
    console.log("게시글 생성:", title, content);
  } catch (e) {
    console.error("게시글 생성 중 오류 발생:", e);
    throw new Error("게시글 생성에 실패했습니다. 다시 시도해 주세요.");
  }

  revalidatePath("/customerservice/cs/write"); // '/posts' 페이지 캐시 갱신
  redirect("/customerservice/cs");
}
