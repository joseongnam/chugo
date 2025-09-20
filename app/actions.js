"use server";

import connectDB from "@/util/database";
import { ObjectId } from "mongodb";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

// 게시글 생성
export async function writePost(formData) {
  const title = formData.get("title");
  const content = formData.get("content");
  const email = formData.get("email");
  const name = formData.get("name");
  const date = new Date();
  const db = (await connectDB).db("chugo");

  try {
    const result = await db.collection("cs").insertOne({
      userEmail: email,
      title,
      content: content,
      date: date,
      name: name,
      views: 0,
      totalComment: 0,
    });
    console.log("게시글 생성:", title, content);
  } catch (e) {
    console.error("게시글 생성 중 오류 발생:", e);
    throw new Error("게시글 생성에 실패했습니다. 다시 시도해 주세요.");
  }

  revalidatePath("/customerservice/cs/write"); // '/posts' 페이지 캐시 갱신
  redirect("/customerservice/cs");
}

export async function views(id) {
  const db = (await connectDB).db("chugo");
  try {
    const result = await db
      .collection("cs")
      .updateOne({ _id: new ObjectId(id) }, { $inc: { views: 1 } });
    console.log("조회수증가:", result);
  } catch (e) {
    console.error("조회수증가 중 오류 발생:", e);
    throw new Error("조회수 증가에 실패했습니다. 다시 시도해 주세요.");
  }
}

export async function commentPost(formData) {
  const postId = formData.get("postId");
  const comment = formData.get("comment");
  const name = formData.get("name");
  const email = formData.get("email");
  const date = new Date();
  const db = (await connectDB).db("chugo");
  const preComment = await db
    .collection("comment")
    .countDocuments({ postId: postId });

  if (!postId || !comment || !name) {
    throw new Error("필수 데이터가 누락되었습니다.");
  }

  try {
    const result = await db.collection("comment").insertOne({
      postId: postId,
      comment: comment,
      name: name,
      email: email,
      date: date,
    });

    const result2 = await db
      .collection("cs")
      .updateOne(
        { _id: new ObjectId(postId) },
        { $set: { totalComment: preComment + 1 } }
      );

    console.log("조회수증가:", result);
  } catch (e) {
    console.error("댓글달기 중 오류 발생:", e);
    throw new Error("댓글달기에 실패했습니다. 다시 시도해 주세요.");
  }
  revalidatePath(`/customerservice/cs/detail/${postId}`); // '/posts' 페이지 캐시 갱신
  redirect(`/customerservice/cs/detail/${postId}`);
}
