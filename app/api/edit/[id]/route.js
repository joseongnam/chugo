import connectDB from "@/util/database";
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
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
  const { id } = params;
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

  const deleteKey = product.imageUrl.replace(
    `https://${process.env.AWS_S3_BUCKET_NAME}.s3.ap-northeast-2.amazonaws.com/`,
    ""
  );
  const deleteCommand = new DeleteObjectCommand({
    Bucket: process.env.AWS_S3_BUCKET_NAME,
    Key: deleteKey, // 업로드할 때 사용한 uploadKey와 동일해야 함
  });
  const deleteS3result = await s3.send(deleteCommand);

  const form = new Formidable({ multiples: false }); // ✅ 최신 버전 방식

  const buffer = Buffer.from(await request.arrayBuffer());

  const headers = {};
  request.headers.forEach((value, key) => {
    headers[key.toLowerCase()] = value;
  });

  const stream = Readable.from(buffer);
  stream.headers = headers;
  stream.method = "PUT";
  stream.url = `/api/PUT/${id}`;

  const data = await new Promise((resolve, reject) => {
    form.parse(stream, (err, fields, files) => {
      if (err) reject(err);
      else resolve({ fields, files });
    });
  });

  const getSingleValue = (val) => (Array.isArray(val) ? val[0] : val);

  try {
    const { fields, files } = data;
    const file = Array.isArray(files.image) ? files.image[0] : files.image;
    if (!file) {
      return NextResponse.json({ error: "이미지 파일 필요" }, { status: 400 });
    }

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

    const fileContent = fs.readFileSync(file.filepath);
    const uploadKey = `products/${Date.now()}_${file.originalFilename}`;

    const uploadCommand = new PutObjectCommand({
      Bucket: process.env.AWS_S3_BUCKET_NAME,
      Key: uploadKey,
      Body: fileContent,
      ContentType: file.mimetype,
    });

    const s3Result = await s3.send(uploadCommand);
    const imageUrl = `https://${process.env.AWS_S3_BUCKET_NAME}.s3.ap-northeast-2.amazonaws.com/${uploadKey}`;

    const tag = (Array.isArray(fields.tag) ? fields.tag[0] : fields.tag)
      .split(",")
      .map((tag) => tag.trim())
      .filter((tag) => tag.length > 0);

    const result = await db.collection("products").updateOne(
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
          tag: tag,
          imageUrl,
          editAt: new Date(),
        },
      }
    );

    return NextResponse.json(
      { message: "상품 수정 완료", title: result.title },
      {
        status: 200,
      }
    );
  } catch (err) {
    console.error("업로드 실패", err);
    return NextResponse.json({ error: "서버 오류 발생" }, { status: 500 });
  }
}
