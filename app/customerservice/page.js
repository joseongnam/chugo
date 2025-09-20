import connectDB from "@/util/database";
import Link from "next/link";

export default async function CustomerService() {
  const db = (await connectDB).db("chugo");
  const csData = await db.collection("cs").find().toArray();
  const qnaData = await db.collection("qna").find().toArray();
  return (
    <div className="cs-container">
      <div className="cs-title">무엇이든 물어보세요!</div>
      <div className="cs-content">
        <Link href="/customerservice/qna" className="cs-subtitle">
          Q&A
        </Link>
        <Link href="/customerservice/cs" className="cs-subtitle">
          게시판
        </Link>
      </div>
    </div>
  );
}
