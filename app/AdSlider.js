"use client";

import { useEffect, useState } from "react";

export default function AdSlider({ ad }) {
  let [page, setPage] = useState(0);
  useEffect(() => {
    if (ad.length === 0) return; // 이미지 없으면 동작하지 않도록

    const interval = setInterval(() => {
      setPage((prev) => (prev + 1) % ad.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [ad]);

  return (
    <div className="AdSlide">
      <div
        style={{
          transform: `translateX(-${100 * page}vw)`,
          transition: "transform 0.5s ease",
        }}
      >
        {ad.map((item, index) => {
          return <img src={item.imageUrl} alt="광고" key={index} />;
        })}
      </div>
      <div className="arrow">
        <span
          onClick={(prev) => {
            setPage((prev) => (prev - 1 + ad.length) % ad.length);
          }}
        >
          &lt;
        </span>
        <span
          onClick={(prev) => {
            setPage((prev) => (prev + 1) % ad.length);
          }}
        >
          &gt;
        </span>
      </div>
    </div>
  );
}
