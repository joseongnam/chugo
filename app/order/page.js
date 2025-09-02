export default function Order() {
  return (
    <div className="order-background">
      <div className="up-nav">
        <div>&lt;</div>
        <div>YOGO</div>
        <div>
          <span>
            <i className="bi bi-bag"></i>
          </span>
          <span>
            <i className="bi bi-person"></i>
          </span>
        </div>
      </div>
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
              <div></div>
            </div>
          </div>
        </div>
        <div className="order-form">
          <div>주문상품</div>
          <div>상품정보들,결국 맵 써야됨</div>
          <div>배송비 및 금액</div>
        </div>
        <div>
          <div>결제정보</div>
          <div>결제수단</div>
          <div>약관동의 및 결제버튼</div>
        </div>
      </form>
    </div>
  );
}
