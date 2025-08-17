"use client";

import { useEffect, useState } from "react";

export default function Cart() {
  const [products, setProducts] = useState([]);
  const [deleteId, setDeleteId] = useState("");
  const [selectedIds, setSelectedIds] = useState([]);

  const totalPrice = products
    .filter((product) => selectedIds.includes(product._id))
    .reduce((acc, product) => acc + product.price, 0);

  const totalDiscount = products
    .filter((product) => selectedIds.includes(product._id))
    .reduce(
      (acc, product) => acc + product.price * (product.discount / 100),
      0
    );

  const totalDiscountPrice = totalPrice - totalDiscount;

  useEffect(() => {
    const cartIds = JSON.parse(localStorage.getItem("cart") || "[]");

    if (cartIds.length > 0) {
      // 2. 서버 API 호출
      fetch("/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids: cartIds }),
      })
        .then(async (res) => {
          if (!res.ok) {
            console.error("서버 응답 오류:", res.status);
            return [];
          }
          try {
            return await res.json();
          } catch (err) {
            console.error("JSON 파싱 오류:", err);
            return [];
          }
        })
        .then((data) => {
          setProducts(data);
          setSelectedIds(data.map((p) => p._id));
        })
        .catch((err) => console.error("Fetch 에러:", err));
    }
  }, []);
  useEffect(() => {
    if (deleteId) {
      setProducts((prevProducts) =>
        prevProducts.filter((product) => product._id !== deleteId)
      );

      const cartIds = JSON.parse(localStorage.getItem("cart") || "[]");
      localStorage.setItem(
        "cart",
        JSON.stringify(cartIds.filter((id) => id !== deleteId))
      );

      setDeleteId("");
    }
  }, [deleteId]);

  return (
    <div className="basket">
      <h4 style={{ fontWeight: "bold" }}>장바구니</h4>
      <div className="basket-summary">장바구니-주문서작성-주문완료</div>
      <div className="basket-items">
        <div className="selected-product-box">
          <h5>장바구니 상품</h5>
          <div style={{ backgroundColor: "lightgray" }}>
            일반상품({products.length})
          </div>
          {products.map((data, index) => {
            return (
              <div key={index}>
                <div className="selected-product">
                  <div
                    style={{ flex: 4, display: "flex", alignItems: "center" }}
                  >
                    <div style={{ flex: 1 }}>
                      <input
                        type="checkBox"
                        className="check-box"
                        checked={selectedIds.includes(data._id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedIds((prev) => [...prev, data._id]);
                          } else {
                            setSelectedIds((prev) =>
                              prev.filter((id) => id !== data._id)
                            );
                          }
                        }}
                      />
                    </div>
                    <div style={{ flex: 3 }}>
                      <img src={data.imageUrl} alt="선택된상품사진" />
                    </div>
                  </div>

                  <div style={{ flex: 10 }}>{data.title}</div>
                  <div style={{ flex: 4 }}>
                    <div>
                      <button
                        className="close-btn"
                        onClick={() => setDeleteId(data._id)}
                      >
                        ×
                      </button>
                    </div>
                    <div>
                      <button className="white-btn">관심상품</button>
                      <button className="blue-btn">주문하기</button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        <div className="price-total">
          <div className="price-total-amount">
            <div>
              <div className="amount-box">
                <p>총 상품금액</p>
                <p>{totalPrice}원</p>
              </div>
              <div className="amount-box">
                <p>총 배송비</p>
                <p>0원</p>
              </div>
              <div className="amount-box">
                <p>총 할인금액</p>
                <p>{totalDiscount}원</p>
              </div>
            </div>
            <div className="amount-box last">
              <p>총 상품금액</p>
              <p>{totalDiscountPrice}원</p>
            </div>
          </div>
          <div style={{ marginTop: "10px", textAlign: "right" }}>
            <button className="white-btn">전체상품주문</button>
            <button className="blue-btn">선택상품주문</button>
          </div>
        </div>
      </div>
    </div>
  );
}
