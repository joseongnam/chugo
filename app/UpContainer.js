"use client";

import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { GiHamburgerMenu } from "react-icons/gi";
import { useUser } from "./UserContext";
import useWindowSize from "./customhook/UseWindowSize";

export default function UpContainer() {
  const { user, setUser } = useUser();
  const router = useRouter();
  const [view, setView] = useState(false);
  const { width } = useWindowSize();
  const isMobile = width !== undefined && width < 866; // 768px 미만이면 모바일로 간주

  // const checkAdmin = async () => {
  //   try {
  //     const res = await fetch("/api/user/admin", {
  //       method: "GET",
  //       credentials: "include",
  //     });

  //     if (!res.ok) {
  //       const errData = await res.json().catch(() => ({}));
  //       throw new Error(errData.message || "관리자 권한 없음");
  //     }

  //     const data = await res.json();
  //     console.log(data);
  //     router.push(data.result ? "/admindashboard" : "/");
  //   } catch (err) {
  //     console.error(err.message);
  //     alert(err.message);
  //     router.push("/");
  //   }
  // };

  const handleLogout = async () => {
    try {
      const currentUser = user;

      // 소셜 로그인인 경우
      if (
        currentUser?.provider === "kakao" ||
        currentUser?.provider === "naver" ||
        currentUser?.provider === "google"
      ) {
        // NextAuth.js의 세션을 먼저 종료
        await signOut({ redirect: false });
        setUser(null);

        // 각 소셜 서비스별 로그아웃 URL로 리디렉션
        if (currentUser.provider === "kakao") {
          const KAKAO_REST_KEY = process.env.NEXT_PUBLIC_KAKAO_CLIENT_ID;
          const logoutRedirectUri = `${window.location.origin}/logged-out`; // 로그아웃 완료 후 이동할 페이지
          window.location.href = `https://kauth.kakao.com/oauth/logout?client_id=${KAKAO_REST_KEY}&logout_redirect_uri=${encodeURIComponent(
            logoutRedirectUri
          )}`;
        } else if (currentUser.provider === "naver") {
          window.location.href =
            "https://nid.naver.com/nidlogin.logout?returl=" +
            encodeURIComponent(window.location.origin);
        } else if (currentUser.provider === "google") {
          window.location.href =
            "https://accounts.google.com/Logout?continue=" +
            encodeURIComponent(window.location.origin);
        }
      } else {
        // 일반 로그인(JWT)인 경우
        await signOut({ redirect: false });
        setUser(null);

        const res = await fetch("/api/user/logout", {
          method: "POST",
          credentials: "include",
        });
        if (!res.ok) {
          console.error("서버 로그아웃 실패");
          return;
        }
        window.location.href = "/";
      }
    } catch (error) {
      console.error("로그아웃 실패:", error);
    }
  };

  return (
    <div style={{ borderBottom: "1px solid #eee" }}>
      <div className="top-banner">
        <a href="/">이달의 리뷰왕</a>
      </div>

      <div className="up-nav">
        {isMobile ? (
          <div className="hamburger-menu" onClick={() => setView(!view)}>
            {view ? "" : <GiHamburgerMenu />}
          </div>
        ) : null}
        <div className="logo" onClick={() => router.push("/")}>
          CHUGO
        </div>
        <div
          className={
            !isMobile ? "middle-nav" : `left-nav ${view ? "show" : ""}`
          }
        >
          <ul>
            {isMobile ? <a href="/login">로그인</a> : null}
            <li
              onClick={() => {
                router.push("/saleproducts");
              }}
            >
              요고특가
            </li>
            <li>모든상품</li>
            <li>리뷰</li>
            <li>이벤트</li>
            <li
              onClick={() => {
                router.push("/customerservice");
                setView(false);
              }}
            >
              고객센터
            </li>
          </ul>
          {isMobile ? (
            <button
              className="close-btn"
              onClick={() => {
                setView(false);
              }}
            >
              &lt;
            </button>
          ) : null}
        </div>
        <div className="right-nav">
          {user ? (
            <>
              <span
                onClick={() => {
                  if (user.isAdmin) {
                    router.push("/admindashboard");
                  } else {
                    alert("관리자만 접근 가능합니다");
                  }
                }}
              >
                {user.name} 님
              </span>
              <span onClick={handleLogout}>로그아웃</span>
            </>
          ) : !isMobile ? (
            <>
              <a href="/login">로그인</a>
              <a href="/join">회원가입</a>
            </>
          ) : (
            ""
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
