"use client";

import { useEffect, useState } from "react";

export default function AdSlider({ ad }) {
  const [page, setPage] = useState(1); // 복제 때문에 1부터 시작
  const [transition, setTransition] = useState(true);
  const [isPaused, setIsPaused] = useState(false); // 슬라이드 일시정지 상태

  // 복제된 배열 만들기
  const slides = [
    ad[ad.length - 1], // 맨 앞에 마지막 이미지 복제
    ...ad,
    ad[0], // 맨 뒤에 첫 이미지 복제
  ];

  // 자동 슬라이드
  useEffect(() => {
    if (ad.length === 0) return;
    if (isPaused) return;

    const interval = setInterval(() => {
      setPage((prev) => prev + 1);
    }, 3000);

    return () => clearInterval(interval);
  }, [ad, isPaused]);

  // 무한 루프 처리
  useEffect(() => {
    if (page === slides.length - 1) {
      // 마지막(복제 첫 페이지) → 첫 페이지로 순간이동
      setTimeout(() => {
        setTransition(false);
        setPage(1);
      }, 500);
    }
    if (page === 0) {
      // 처음(복제 마지막 페이지) → 마지막 페이지로 순간이동
      setTimeout(() => {
        setTransition(false);
        setPage(slides.length - 2);
      }, 500);
    }
  }, [page, slides.length]);

  // 순간이동 후 transition 다시 켜기
  useEffect(() => {
    if (!transition) {
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setTransition(true);
        });
      });
    }
  }, [transition]);

  return (
    <div className="AdSlide">
      <div
        style={{
          display: "flex",
          transform: `translateX(-${100 * page}vw)`,
          transition: transition ? "transform 0.5s ease" : "none",
        }}
        onMouseEnter={() => setIsPaused(true)}   // 마우스 올리면 멈춤
      onMouseLeave={() => setIsPaused(false)}  // 마우스 나가면 재개
      >
        {slides.map((item, index) => (
          <img src={item.imageUrl} alt="광고" key={index} />
        ))}
      </div>
      <div className="arrow">
        <span onClick={() => setPage((prev) => prev - 1)}>&lt;</span>
        <span onClick={() => setPage((prev) => prev + 1)}>&gt;</span>
      </div>
    </div>
  );
}
