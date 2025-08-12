"use client";

import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useUser } from "./UserContext";

export default function UpContainer() {
  const { user, setUser } = useUser();
  const router = useRouter();

  const checkAdmin = async () => {
    try {
      const res = await fetch("/api/user/admin", {
        method: "GET",
        credentials: "include",
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.message || "관리자 권한 없음");
      }

      const data = await res.json();
      console.log(data);
      router.push(data.result ? "/admindashboard" : "/");
    } catch (err) {
      console.error(err.message);
      alert(err.message);
      router.push("/");
    }
  };

  const handleLogout = async () => {
    const res = await fetch("/api/user/logout", {
      method: "POST",
      credentials: "include",
    });
    if (res.ok) {
      setUser(null); // 전역 상태 업데이트
      signOut({ callbackUrl: "/" });
      window.location.reload();
    }
  };

  return (
    <div style={{ borderBottom: "1px solid #eee" }}>
      <div className="top-banner">
        <a href="/">이달의 리뷰왕</a>
      </div>
      <div className="up-nav">
        <div className="logo">CHUGO</div>
        <div className="middle-nav">
          <ul>
            <li>요고특가</li>
            <li>모든상품</li>
            <li>리뷰</li>
            <li>이벤트</li>
            <li>고객센터</li>
          </ul>
        </div>
        <div className="right-nav">
          {user ? (
            <>
              <span onClick={checkAdmin}>{user.name} 님</span>
              <span onClick={handleLogout}>로그아웃</span>
            </>
          ) : (
            <>
              <a href="/login">로그인</a>
              <a href="/join">회원가입</a>
            </>
          )}

          <a href="/">
            <i className="bi bi-search"></i>
          </a>
          <a href="/">
            <i className="bi bi-person"></i>
          </a>
          <a href="/">
            <i className="bi bi-bag"></i>
          </a>
        </div>
      </div>
    </div>
  );
}
