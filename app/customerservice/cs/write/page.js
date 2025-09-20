"use client";

import { writePost } from "@/app/actions";
import { useUser } from "@/app/UserContext";

export default function Write() {
  const { user } = useUser();

  return (
    <div className="cs-container table">
      <h4>글작성</h4>
      <form action={writePost} className="write-form">
        <input name="title" placeholder="글제목" className="write-title" />
        <input name="content" placeholder="글내용" className="write-content" />
        <input type="hidden" name="email" value={user.email} />
        <input type="hidden" name="name" value={user.name} />
        <button type="submit" className="write-page-btn">
          전송
        </button>
      </form>
    </div>
  );
}
