export default function UpContainer() {
  return (
    <div style={{ borderBottom: "1px solid #eee" }}>
      <div className="top-banner">
        <a href="/">이달의 리뷰왕</a>
      </div>
      <div className="up-nav">
        <div className="logo">CHUGO</div>
        <div className="middle-nav">
          <ul>
            <li>요고특가</li>
            <li>모든상품</li>
            <li>리뷰</li>
            <li>이벤트</li>
            <li>고객센터</li>
          </ul>
        </div>
        <div className="right-nav">
          <a href="/">로그인</a>
          <a href="/">회원가입</a>
          <a href="/">
            <i className="bi bi-search"></i>
          </a>
          <a href="/">
            <i className="bi bi-person"></i>
          </a>
          <a href="/">
            <i className="bi bi-bag"></i>
          </a>
        </div>
      </div>
    </div>
  );
}
