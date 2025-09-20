"use client";

import { useRouter } from "next/navigation";

export default function DetailBtn() {
  const router = useRouter();
  return (
    <div className="detail-end">
      <button
        onClick={() => {
          router.push("/customerservice/cs");
        }}
      >
        목록
      </button>
      <button>수정</button>
    </div>
  );
}
