import connectDB from "@/util/database";
import {
  DeleteObjectCommand,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import { Formidable } from "formidable";
import fs from "fs";
import { ObjectId } from "mongodb";
import { NextResponse } from "next/server";
import { Readable } from "stream";

export const config = {
  api: {
    bodyParser: false,
  },
};

// AWS S3 설정
const s3 = new S3Client({
  region: "ap-northeast-2",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

// POST 핸들러 (App Router 방식)
export async function PUT(req, { params }) {
  const { id } = await params;
  const db = (await connectDB).db("chugo");
  const product = await db
    .collection("products")
    .findOne({ _id: new ObjectId(id) });

  if (!product) {
    return NextResponse.json(
      { error: "상품을 찾을 수 없습니다." },
      { status: 404 }
    );
  }

  const form = new Formidable({ multiples: false });
  const buffer = Buffer.from(await req.arrayBuffer());

  const headers = {};
  req.headers.forEach((value, key) => {
    headers[key.toLowerCase()] = value;
  });

  const stream = Readable.from(buffer);
  stream.headers = headers;
  stream.method = "PUT";
  stream.url = `/api/PUT/${id}`;

  try {
    const data = await new Promise((resolve, reject) => {
      form.parse(stream, (err, fields, files) => {
        if (err) reject(err);
        else resolve({ fields, files });
      });
    });

    const getSingleValue = (val) => (Array.isArray(val) ? val[0] : val);
    const { fields, files } = data;

    // 유효성 체크
    if (
      !fields.title ||
      !fields.content ||
      !fields.price ||
      !fields.inventory ||
      !fields.category ||
      !fields.status ||
      !fields.discount ||
      !fields.tag
    ) {
      return NextResponse.json({ error: "입력값 부족" }, { status: 400 });
    }

    let imageUrl = product.imageUrl;
    const file = Array.isArray(files.image) ? files.image[0] : files.image;

    // 파일 새로 올린 경우에만 업로드 + 기존 삭제
    if (file) {
      const fileContent = fs.readFileSync(file.filepath);
      const uploadKey = `products/${Date.now()}_${file.originalFilename}`;

      await s3.send(
        new PutObjectCommand({
          Bucket: process.env.AWS_S3_BUCKET_NAME,
          Key: uploadKey,
          Body: fileContent,
          ContentType: file.mimetype,
        })
      );

      imageUrl = `https://${process.env.AWS_S3_BUCKET_NAME}.s3.ap-northeast-2.amazonaws.com/${uploadKey}`;

      // 기존 이미지 삭제
      if (product.imageUrl) {
        const deleteKey = product.imageUrl.replace(
          `https://${process.env.AWS_S3_BUCKET_NAME}.s3.ap-northeast-2.amazonaws.com/`,
          ""
        );
        await s3.send(
          new DeleteObjectCommand({
            Bucket: process.env.AWS_S3_BUCKET_NAME,
            Key: deleteKey,
          })
        );
      }
    }

    // 태그 처리
    const tag = getSingleValue(fields.tag)
      .split(",")
      .map((t) => t.trim())
      .filter((t) => t.length > 0);

    // DB 업데이트
    await db.collection("products").updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          title: getSingleValue(fields.title),
          content: getSingleValue(fields.content),
          price: parseFloat(fields.price),
          inventory: parseInt(fields.inventory),
          category: getSingleValue(fields.category),
          status: getSingleValue(fields.status),
          discount: parseFloat(fields.discount),
          tag,
          imageUrl,
          updateAt: new Date(),
        },
      }
    );

    return NextResponse.json({ message: "상품 수정 완료" }, { status: 200 });
  } catch (err) {
    console.error("업로드 실패", err);
    return NextResponse.json({ error: "서버 오류 발생" }, { status: 500 });
  }
}
