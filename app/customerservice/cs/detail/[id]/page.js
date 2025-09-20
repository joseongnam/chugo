import connectDB from "@/util/database";
import { ObjectId } from "mongodb";
import DetailBtn from "./detailBtn";

export default async function Detail({ params }) {
  const { id } = await params;
  const db = (await connectDB).db("chugo");
  const data = await db.collection("cs").findOne({ _id: new ObjectId(id) });
  return (
    <div className="cs-container table">
      <div className="detail-all">
        <div className="detail-up">
          <div>{data.title}</div>
          <div>{data.userEmail}</div>
        </div>
        <div className="detail-content">{data.content}</div>
      </div>
      <DetailBtn />
    </div>
  );
}
