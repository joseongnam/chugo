import connectDB from "@/util/database";
import { DeleteObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { ObjectId } from "mongodb";
import { NextResponse } from "next/server";

// AWS S3 설정
const s3 = new S3Client({
  region: "ap-northeast-2",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

export async function DELETE(req, { params }) {
  const { id } = params;
  try {
    const db = (await connectDB).db("chugo");
    const product = await db
      .collection("products")
      .findOne({ _id: new ObjectId(id) });

    const uploadKey = product.imageUrl.replace(
      `https://${process.env.AWS_S3_BUCKET_NAME}.s3.ap-northeast-2.amazonaws.com/`,
      ""
    );
    const command = new DeleteObjectCommand({
      Bucket: process.env.AWS_S3_BUCKET_NAME,
      Key: uploadKey, // 업로드할 때 사용한 uploadKey와 동일해야 함
    });

    const S3result = await s3.send(command);
    const MongoDBresult = await db
      .collection("products")
      .deleteOne({ _id: new ObjectId(id) });
    if (!S3result || !MongoDBresult) {
      return NextResponse.json(
        { message: "상품 삭제 실패" },
        {
          status: 400,
        }
      );
    }
    return NextResponse.json(
      { message: "상품 삭제 완료", title: MongoDBresult.title },
      {
        status: 200,
      }
    );
  } catch (err) {
    console.error("삭제 실패", err);
    return NextResponse.json({ error: "서버 오류 발생" }, { status: 500 });
  }
}
