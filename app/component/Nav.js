import { useState } from "react";

export default function Nav() {
  const [view, setView] = useState(false);

  return (
    <div style={{ borderBottom: "1px solid #eee" }}>
      <div className="top-banner">
        <a href="/">이달의 리뷰왕</a>
      </div>

      <div className="up-nav">
        <div className="logo" onClick={() => router.push("/")}>
          CHUGO
        </div>
      <div
        className={`left-nav ${view ? "" : "hide"}`}
        onClick={() => setView(!view)}
      >
        <div>
          <ul>
            <li>X</li>
            <li>요고특가</li>
            <li>모든상품</li>
            <li>리뷰</li>
            <li>이벤트</li>
            <li>고객센터</li>
          </ul>
        </div>
      </div>
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
