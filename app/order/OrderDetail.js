"use client";

import { useEffect, useState } from "react";

export default function OrderDetail({ products }) {
  const [items, setItems] = useState([]);
  const pay = [
    "토스",
    "무통장입금",
    "카드결제",
    "가상계좌",
    "실시간 계좌이체",
    "휴대폰결제",
  ];
  const [activeIndex, setActiveIndex] = useState(null);

  const totalPrice = items.reduce((acc, p) => acc + p.price * p.quantity, 0);

  const totalDiscount = items.reduce(
    (acc, p) => acc + p.price * (p.discount / 100) * p.quantity,
    0
  );

  const totalDiscountPrice = totalPrice - totalDiscount;

  useEffect(() => {
    const orderItems = JSON.parse(localStorage.getItem("orderItems") || "[]");
    orderItems.map((prev) => {
      const found = products.find((item) => item._id === prev.id);
      if (found) {
        setItems((prevItems) => [
          ...prevItems,
          { ...found, quantity: prev.quantity },
        ]);
      }
    });
  }, []);

  return (
    <>
      <div className="order-title">주문/결제</div>
      <form>
        <div>
          <div className="form-title orderline">
            <div>주문정보</div>
            <div>&and;</div>
          </div>
          <div className="order-form">
            <div>
              <label>
                <span>주문자</span> <span className="required">*</span>
              </label>
              <input type="text" />
            </div>
            <div>
              <label>
                <span>휴대전화</span> <span className="required">*</span>
              </label>
              <div className="phone-row" style={{ flex: 9 }}>
                <select>
                  <option value={"010"}>010</option>
                  <option value={"011"}>011</option>
                </select>
                -
                <input type="text" maxLength={4} />
                -
                <input type="text" maxLength={4} />
              </div>
            </div>
          </div>
        </div>
        <div>
          <div className="form-title orderline">
            <div>배송지</div>
            <div>&and;</div>
          </div>

          <div className="radio-row">
            <div>
              <input type="radio" name="delivery" />
              <label htmlFor="">주문자 정보와 동일</label>
            </div>
            <div>
              <input type="radio" name="delivery" />
              <label htmlFor="">새로운 배송지</label>
            </div>
          </div>
          <div className="order-form">
            <div>
              <label>
                <span>받는사람</span> <span className="required">*</span>
              </label>
              <input type="text" />
            </div>
            <div>
              <label>
                <span>주소</span> <span className="required">*</span>
              </label>
              <div className="address">
                <input type="text" placeholder="우편번호" />
                <button type="white-btn">주소검색</button>
              </div>
            </div>
            <div>
              <label></label>
              <input type="text" placeholder="기본주소" />
            </div>
            <div>
              <label></label>
              <input type="text" placeholder="나머지주소(선택 입력 가능)" />
            </div>

            <div>
              <label>
                <span>휴대전화</span> <span className="required">*</span>
              </label>
              <div className="phone-row" style={{ flex: 9 }}>
                <select>
                  <option value={"010"}>010</option>
                  <option value={"011"}>011</option>
                </select>
                -
                <input type="text" maxLength={4} />
                -
                <input type="text" maxLength={4} />
              </div>
            </div>
          </div>
          <div className="delivery-require">
            <div className="order-form">
              <select name="" id="">
                <option value="">-- 메세지 선택 (선택 사항) --</option>
                <option value="">배송 전에 미리 연락바랍니다.</option>
                <option value="">부재 시 경비실에 맡겨주세요.</option>
                <option value="">부재 시 문 앞에 놓아주세요.</option>
                <option value="">빠른 배송 부탁드립니다.</option>
                <option value="">택배함에 보관해 주세요.</option>
                <option value="">직접 입력</option>
              </select>
            </div>
            <div className="delivery-hidden">
              <input type="text" style={{ height: "60px" }} />
            </div>
            <div style={{ padding: "20px" }}>
              <div>
                <input type="checkbox" />
                <span>배송지 정보로 간편 회원가입</span>
                <p>이메일, 비밀번호만으로 간편하게 회원가입이 가능합니다</p>
                <p>
                  회원가입 후 쿠폰, 이벤트 등 할인혜택을 받으실 수 있습니다.
                </p>
              </div>
            </div>
            <div className="order-pw-check">
              <div style={{ fontWeight: "bold", marginBottom: "20px" }}>
                비회원 주문조회 비밀번호
              </div>
              <div>
                <div className="pw-check">
                  <label htmlFor="">비밀번호</label>
                  <input type="text" />
                </div>
                <p>
                  (영문대소문자/숫자/특수문자 중 2가지 이상 조합, 10자~16자)
                </p>
                <div className="pw-check">
                  <label htmlFor="">비밀번호 확인</label>
                  <input type="text" />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className=" form-titleorderline" style={{ padding: "20px" }}>
          <h5>주문상품</h5>
          {items.map((item, index) => (
            <div className="order-products" key={index}>
              <img src={item?.imageUrl} alt="사진" />
              <div>
                <h5>{item?.title}</h5>
                <p style={{ color: "#a3a3a3ff" }}>[옵션: ]</p>
                <p style={{ color: "#a3a3a3ff" }}>수량: {item.quantity}개</p>
                <p>금액: {item?.price}원</p>
              </div>
            </div>
          ))}
        </div>
        <div className="form-title order-products-delivery">
          <span>배송비</span>
          <span>0원</span>
        </div>
        <div>
          <div className="orderline all-order-price">
            <div style={{ marginBottom: "20px" }}>
              <h5>결제정보</h5>
              <div>&and;</div>
            </div>

            <div>
              <p>주문상품</p>
              <p>{totalPrice}원</p>
            </div>
            <div>
              <p>배송비</p>
              <p>0원</p>
            </div>
            <div>
              <p>할인/부가결제</p>
              <p>{totalDiscount}원</p>
            </div>
          </div>
          <div className="allPrice">
            <p>결제금액</p>
            <p style={{ color: "blue" }}>{totalDiscountPrice}원</p>
          </div>
          <div>
            <div className="form-title orderline">
              <div>결제수단</div>
              <div>&and;</div>
            </div>
            <div>
              <p style={{ marginLeft: "20px" }}>결제수단 선택</p>
              <div className="order-payment">
                {pay.map((method, index) => (
                  <div
                    key={index}
                    className={activeIndex === index ? "pay-active" : ""}
                    onClick={() => setActiveIndex(index)}
                  >
                    {method}
                  </div>
                ))}
              </div>
            </div>
            <div>
              <div className="info-payment">
                <p>-토스는 간편하게</p>
                <p>-토스 결제 후</p>
                <p>-토스 이용가능 결제수단</p>
              </div>
            </div>
          </div>
          <div className="order-blue-btn">약관동의 및 결제버튼</div>
          <div className="order-explanation">
            <p>-설명</p>
            <p>-설명</p>
          </div>
        </div>
      </form>
    </>
  );
}
