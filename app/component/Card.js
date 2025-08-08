"use client";

export default function Card({ title, content, price, discount, imageUrl }) {
  let discountPrice = price * (1 - discount / 100);
  return (
    <div className="product-card">
      <img src={imageUrl} alt="상품이미지" />
      <h4>제목 : {title}</h4>
      <p>설명 : {content}</p>
      <p>가격 : {price}원</p>
      <div>
        <span>할인율 : {discount}%</span>
      </div>
      <p>할인가 : {discountPrice}원</p>
      <span
        style={{
          color: "white",
          backgroundColor: "blue",
          borderRadius: "10px",
          fontSize: "small",
          padding: "3px",
        }}
      >
        요고특가
      </span>
      <span
        style={{
          color: "white",
          backgroundColor: "rgb(180, 200, 255)",
          borderRadius: "10px",
          fontSize: "small",
          padding: "3px",
        }}
      >
        무료배송
      </span>
      <p>리뷰(100)</p>
    </div>
  );
}
