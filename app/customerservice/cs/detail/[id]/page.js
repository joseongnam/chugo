import { commentPost } from "@/app/actions";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import connectDB from "@/util/database";
import { ObjectId } from "mongodb";
import { getServerSession } from "next-auth";
import DetailBtn from "./DetailBtn";

export default async function Detail({ params }) {
  const { id } = await params;
  const db = (await connectDB).db("chugo");
  const data = await db.collection("cs").findOne({ _id: new ObjectId(id) });
  const user = await db.collection("user").findOne({ email: data.userEmail });
  const session = await getServerSession(authOptions);
  if (!session) {
    console.log("로그인되지 않은 사용자입니다.");
  }
  const userName = session?.user?.name || "손님";
  const userEmail = session?.user?.email || "없음";

  const commentList = await db.collection("comment").find().toArray();
  console.log(commentList);
  return (
    <div className="cs-container table">
      <div className="detail-all">
        <div className="detail-up">
          <div>{data.title}</div>
          <div>{user.name}</div>
        </div>
        <div className="detail-content">{data.content}</div>
        {commentList.map((item, index) => {
          return (
            <div className="comment" key={index}>
              <div>{item.name}</div>
              <div>{item.comment}</div>
              <div>
                {item.date.toLocaleString("ko-KR", {
                  year: "2-digit",
                  month: "2-digit",
                  day: "2-digit",
                  hour: "2-digit",
                  minute: "2-digit",
                  hour12: false,
                })}
              </div>
              <div>좋아요</div>
            </div>
          );
        })}

        <form className="comment-input" action={commentPost}>
          <input type="text" name="comment" />
          <input type="hidden" name="name" value={userName} />
          <input type="hidden" name="email" value={userEmail} />
          <input type="hidden" name="postId" value={id} />
          <button type="submit">댓글달기</button>
        </form>
      </div>
      <DetailBtn />
    </div>
  );
}
