"use client";

import { useEffect, useState } from "react";

export default function OrderDetail({ products }) {
  const [deliveryMessage, setDeliveryMessage] = useState("");
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

  const [deliveryRequire, setDeliveryRequire] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("결제 금액:", totalDiscountPrice);
    console.log(window.IMP);
    console.log(e.target);
    console.log(name);

    const formData = new FormData(e.target);
    const name = formData.get("name");
    const phone1 = formData.get("phone1");
    const phone2 = formData.get("phone2");
    const phone3 = formData.get("phone3");
    const receiver = formData.get("receiver");
    const rephone1 = formData.get("rephone1");
    const rephone2 = formData.get("rephone2");
    const rephone3 = formData.get("rephone3");
    const zipcode = formData.get("zipcode");
    const address1 = formData.get("address1");
    const orderPw = formData.get("orderPw");
    const orderPwConfirm = formData.get("orderPwConfirm");

    // 필수값 검사
    if (
      !name ||
      !phone1 ||
      !phone2 ||
      !phone3 ||
      !receiver ||
      !rephone1 ||
      !rephone2 ||
      !rephone3 ||
      !zipcode ||
      !address1 ||
      !orderPw ||
      !orderPwConfirm
    ) {
      alert("필수 입력값을 모두 채워주세요.");
      return;
    }

    if (orderPw !== orderPwConfirm) {
      alert("비밀번호와 비밀번호 확인이 일치하지 않습니다.");
      return;
    }

    if (!window.IMP) return;
    const IMP = window.IMP;

    IMP.request_pay(
      {
        pg: "html5_inicis",
        pay_method: "card",
        merchant_uid: `mid_${new Date().getTime()}`,
        name: "테스트 결제",
        amount: totalDiscountPrice,
        buyer_email: "test@example.com",
        buyer_name: name, // 수정
        buyer_tel: `${phone1}-${phone2}-${phone3}`, // 수정
        buyer_addr: `${address1} ${formData.get("address2")}`,
        buyer_postcode: zipcode, // 수정
      },
      async (rsp) => {
        if (rsp.success) {
          const orderData = {
            name: formData.get("name"),
            phone: `${formData.get("phone1")}-${formData.get(
              "phone2"
            )}-${formData.get("phone3")}`,
            receiver: formData.get("receiver"),
            rephone: `${formData.get("rephone1")}-${formData.get(
              "rephone2"
            )}-${formData.get("rephone3")}`,
            address: `${formData.get("address1")} ${formData.get("address2")}`,
            zipcode: formData.get("zipcode"),
            deliveryMessage: formData.get("deliveryMessage"),
            totalPrice: totalDiscountPrice,
            deliveryMessage: deliveryMessage,
            orderPw: formData.get("orderPw"),
            orderPwConfirm: formData.get("orderPwConfirm"),
          };

          const res = await fetch("/api/post/order", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              imp_uid: rsp.imp_uid,
              merchant_uid: rsp.merchant_uid,
              orderData,
            }),
          });

          const data = await res.json();
          if (res.ok) {
            alert("주문 성공!");
          } else {
            alert("실패: " + data.error);
          }
        }
      }
    );
  };

  useEffect(() => {
    const storedItems = JSON.parse(localStorage.getItem("orderItems") || "[]");
    const orderItemsData = storedItems
      .map((prev) => {
        const found = products.find((item) => item._id === prev.id);
        return found ? { ...found, quantity: prev.quantity } : null;
      })
      .filter(Boolean);
    setItems(orderItemsData);
  }, [products]);

  useEffect(() => {
    // 아임포트 스크립트 로드
    const script = document.createElement("script");
    script.src = "https://cdn.iamport.kr/js/iamport.payment-1.2.0.js";
    script.async = true;
    document.body.appendChild(script);

    script.onload = () => {
      // 가맹점 식별코드 넣기 (포트원 대시보드에서 확인 가능)
      if (window.IMP) {
        IMP.init("imp44484754");
      }
    };
  }, []);

  return (
    <>
      <div className="order-title">주문/결제</div>
      <form onSubmit={handleSubmit}>
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
              <input type="text" name="name" />
            </div>
            <div>
              <label>
                <span>휴대전화</span> <span className="required">*</span>
              </label>
              <div className="phone-row" style={{ flex: 9 }}>
                <select name="phone1">
                  <option value={"010"}>010</option>
                  <option value={"011"}>011</option>
                </select>
                -
                <input type="text" maxLength={4} name="phone2" />
                -
                <input type="text" maxLength={4} name="phone3" />
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
              <input type="radio" />
              <label htmlFor="">주문자 정보와 동일</label>
            </div>
            <div>
              <input type="radio" />
              <label htmlFor="">새로운 배송지</label>
            </div>
          </div>
          <div className="order-form">
            <div>
              <label>
                <span>받는사람</span> <span className="required">*</span>
              </label>
              <input type="text" name="receiver" />
            </div>
            <div>
              <label>
                <span>주소</span> <span className="required">*</span>
              </label>
              <div className="address">
                <input type="text" placeholder="우편번호" name="zipcode" />
                <button type="button" className="white-btn">
                  주소검색
                </button>
              </div>
            </div>
            <div>
              <label></label>
              <input type="text" placeholder="기본주소" name="address1" />
            </div>
            <div>
              <label></label>
              <input
                type="text"
                placeholder="나머지주소(선택 입력 가능)"
                name="address2"
              />
            </div>

            <div>
              <label>
                <span>휴대전화</span> <span className="required">*</span>
              </label>
              <div className="phone-row" style={{ flex: 9 }}>
                <select name="rephone1">
                  <option value={"010"}>010</option>
                  <option value={"011"}>011</option>
                </select>
                -
                <input type="text" maxLength={4} name="rephone2" />
                -
                <input type="text" maxLength={4} name="rephone3" />
              </div>
            </div>
          </div>
          <div className="delivery-require">
            <div className="order-form">
              <select
                name="deliveryMessage"
                onChange={(e) => setDeliveryMessage(e.target.value)}
              >
                <option value="X">-- 메세지 선택 (선택 사항) --</option>
                <option value="배송 전에 미리 연락바랍니다">
                  배송 전에 미리 연락바랍니다.
                </option>
                <option value="부재 시 경비실에 맡겨주세요">
                  부재 시 경비실에 맡겨주세요.
                </option>
                <option value="부재 시 문 앞에 놓아주세요">
                  부재 시 문 앞에 놓아주세요.
                </option>
                <option value="빠른 배송 부탁드립니다">
                  빠른 배송 부탁드립니다.
                </option>
                <option value="택배함에 보관해 주세요">
                  택배함에 보관해 주세요.
                </option>
                <option value="direct">직접 입력</option>
              </select>
            </div>
            <div className="delivery-hidden">
              <input
                type="text"
                style={{ height: "60px" }}
                name="deliveryMessage"
                onChange={(e) => setDeliveryMessage(e.target.value)}
              />
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
                  <input type="text" name="orderPw" />
                </div>
                <p>
                  (영문대소문자/숫자/특수문자 중 2가지 이상 조합, 10자~16자)
                </p>
                <div className="pw-check">
                  <label htmlFor="">비밀번호 확인</label>
                  <input type="text" name="orderPwConfirm" />
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
          <button type="submit" className="order-blue-btn">
            약관동의 및 결제버튼
          </button>
          <div className="order-explanation">
            <p>-설명</p>
            <p>-설명</p>
          </div>
        </div>
      </form>
    </>
  );
}
