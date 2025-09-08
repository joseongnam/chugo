import connectDB from "@/util/database";
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { Formidable } from "formidable";
import fs from "fs";
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
export const dynamic = "force-dynamic";
export async function POST(request) {
  const form = new Formidable({ multiples: false }); // ✅ 최신 버전 방식

  const buffer = Buffer.from(await request.arrayBuffer());

  const headers = {};
  request.headers.forEach((value, key) => {
    headers[key.toLowerCase()] = value;
  });

  const stream = Readable.from(buffer);
  stream.headers = headers;
  stream.method = "POST";
  stream.url = "/api/ad/new";

  const data = await new Promise((resolve, reject) => {
    form.parse(stream, (err, fields, files) => {
      if (err) reject(err);
      else resolve({ fields, files });
    });
  });

  const getSingleValue = (val) => (Array.isArray(val) ? val[0] : val);

  try {
    const { fields, files } = data;
    const file = files.image;

    if (!fields.title || !fields.productId || !file[0]) {
      return new Response(JSON.stringify({ error: "입력값 부족" }), {
        status: 400,
      });
    }

    const fileContent = fs.readFileSync(file[0].filepath);
    const uploadKey = `ad/${Date.now()}_${
      file[0].originalFilename || file[0].newFilename
    }`;

    const uploadCommand = new PutObjectCommand({
      Bucket: process.env.AWS_S3_BUCKET_NAME,
      Key: uploadKey,
      Body: fileContent,
      ContentType: file[0].mimetype,
    });

    const s3Result = await s3.send(uploadCommand);
    const imageUrl = `https://${process.env.AWS_S3_BUCKET_NAME}.s3.ap-northeast-2.amazonaws.com/${uploadKey}`;

    const db = (await connectDB).db("chugo");
    const result = await db.collection("ad").insertOne({
      title: getSingleValue(fields.title),
      productId: getSingleValue(fields.productId),
      imageUrl,
      createdAt: new Date(),
    });

    return new Response(
      JSON.stringify({ message: "광고 등록 완료", title: result.title }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (err) {
    console.error("업로드 실패", err);
    return new Response(JSON.stringify({ error: "서버 오류 발생" }), {
      status: 500,
    });
  }
}
