"use client";

import { useRouter } from "next/navigation";

export default function DetailBtn({ id }) {
  const router = useRouter();
  const handleCart = () => {
    const existingCart = JSON.parse(localStorage.getItem("cart") || "[]");
    existingCart.push(id);
    localStorage.setItem("cart", JSON.stringify(existingCart));
    router.push("/Cart");
  };
  return (
    <>
      <button
        onClick={() => {
          handleCart();
        }}
      >
        장바구니
      </button>
      <button>바로구매</button>
    </>
  );
}
