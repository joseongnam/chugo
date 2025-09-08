"use client";

import { useEffect, useState } from "react";

export default function Cart() {
  const [products, setProducts] = useState([]);
  const [deleteId, setDeleteId] = useState("");
  const [selectedIds, setSelectedIds] = useState([]);

  const totalPrice = products
    .filter((p) => selectedIds.includes(p._id))
    .reduce((acc, p) => acc + p.price * (p.quantity || 1), 0);

  const totalDiscount = products
    .filter((p) => selectedIds.includes(p._id))
    .reduce(
      (acc, p) => acc + p.price * (p.discount / 100) * (p.quantity || 1),
      0
    );

  const totalDiscountPrice = totalPrice - totalDiscount;

  const handleQuantityChange = (id, delta) => {
    setProducts((prev) =>
      prev.map((p) => {
        if (p._id === id) {
          const newQty = Math.max(1, (p.quantity || 1) + delta);
          return { ...p, quantity: newQty };
        }
        return p;
      })
    );
  };

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
          const dataWithQuantity = data.map((p) => ({ ...p, quantity: 1 }));
          setProducts(dataWithQuantity);
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

  const handleOrder = () => {
    const orderItems = products
      .filter((p) => selectedIds.includes(p._id))
      .map((p) => ({
        id: p._id,
        quantity: p.quantity,
      }));

    localStorage.setItem("orderItems", JSON.stringify(orderItems));
    window.location.href = "/order";
  };

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

                  <div style={{ flex: 10 }}>
                    <div>{data.title}</div>
                    <div>{data.price}원</div>
                    <div>옵션</div>
                    <div className="quantity-box">
                      <button
                        style={{ borderRight: 0 }}
                        onClick={() => handleQuantityChange(data._id, -1)}
                      >
                        -
                      </button>
                      <input
                        type="number"
                        value={data.quantity}
                        onChange={(e) => {
                          const val = Math.max(
                            1,
                            parseInt(e.target.value) || 1
                          );
                          setProducts((prev) =>
                            prev.map((p) =>
                              p._id === data._id ? { ...p, quantity: val } : p
                            )
                          );
                        }}
                      />
                      <button
                        style={{ borderLeft: 0, margin: 0 }}
                        onClick={() => handleQuantityChange(data._id, 1)}
                      >
                        +
                      </button>

                      <button style={{ fontSize: 8, width: 40 }}>변경</button>
                    </div>
                  </div>
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
            <button className="blue-btn" onClick={handleOrder}>
              선택상품주문
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
