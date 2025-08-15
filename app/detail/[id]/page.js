import connectDB from "@/util/database";
import { ObjectId } from "mongodb";

export default async function Detail({ params }) {
  const db = (await connectDB).db("chugo");
  const product = await db
    .collection("products")
    .findOne({ _id: new ObjectId(params) });
  return (
    <div className="detail">
      <div className="location">
        <span>Home/</span>
        <span>모든상품</span>
      </div>
      <div className="detail-product">
        <div className="product-photo">
          <div>
            <img src={product.imageUrl} alt="메인사진" />
          </div>
          <div>
            <img src="" alt="서브사진" />
            <img src="" alt="서브사진" />
            <img src="" alt="서브사진" />
            <img src="" alt="서브사진" />
            <img src="" alt="서브사진" />
          </div>
        </div>
        <div className="purchase-explain">
          <div
            className="container my-2 product-page"
            style={{ width: "100%" }}
          >
            {/* 상품 타이틀 */}
            <div className="mb-1">
              <h5 className="text-warning mb-1">⭐ 4.9 | 리뷰 140건</h5>
              <h2 className="fw-bold">{product.tilte}</h2>
            </div>

            {/* 설명 */}
            <div className="text-primary fw-bold mb-3">
              NEW! 새로나온 신상 과일
            </div>
            <ul className="small text-muted mb-4">
              <li>존맛탱!</li>
              <li>달콤해@</li>
              <li>예에~</li>
            </ul>

            {/* 가격 */}
            <div className="d-flex align-items-center mb-3">
              <span className="text-muted text-decoration-line-through me-2 fs-5">
                {product.price}원
              </span>
              <span className="text-danger fw-bold me-2 fs-4">
                {product.discount}%
              </span>
              <span className="fw-bold fs-4">
                {product.price - (product.price * product.discount) / 100}원
              </span>
            </div>

            {/* 혜택 배너 */}
            <div className="bg-light p-3 rounded mb-3">
              <strong>토스페이로 결제하면 2,000원 즉시 할인!</strong>
            </div>

            {/* 배송정보 */}
            <div className="mb-4 small text-muted">
              배송비: 3,500원 (50,000원 이상 구매 시 무료)
            </div>

            {/* 옵션 */}
            <div className="accordion" id="productOptions">
              <div className="accordion-item">
                <h2 className="accordion-header" id="headingOne">
                  <button
                    className="accordion-button"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#option1"
                    aria-expanded="true"
                    aria-controls="option1"
                  >
                    상품
                  </button>
                </h2>
                <div
                  id="option1"
                  className="accordion-collapse collapse show"
                  aria-labelledby="headingOne"
                  data-bs-parent="#productOptions"
                >
                  <div className="accordion-body">
                    <ul className="list-unstyled">
                      <li className="mb-3">
                        <strong>[SET 1]</strong> 제로사과 1개 + 제로바나나 1개
                        <span className="float-end fw-bold">58,100원</span>
                      </li>
                      <li className="mb-3">
                        <strong>[SET 2]</strong> 제로사과 2개 + 제로바나나 2개
                        <span className="float-end fw-bold">107,800원</span>
                      </li>
                      <li>
                        <strong>[SET 3]</strong> 제로사과 3개 + 제로바나나 3개
                        엘라 제로 3개
                        <span className="float-end fw-bold">157,500원</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="product-info">
        <ul className="nav nav-tabs" id="myTab" role="tablist">
          <li className="nav-item" role="presentation">
            <button
              className="nav-link active"
              id="home-tab"
              data-bs-toggle="tab"
              data-bs-target="#home-tab-pane"
              type="button"
              role="tab"
              aria-controls="home-tab-pane"
              aria-selected="true"
            >
              상세정보
            </button>
          </li>
          <li className="nav-item" role="presentation">
            <button
              className="nav-link"
              id="profile-tab"
              data-bs-toggle="tab"
              data-bs-target="#profile-tab-pane"
              type="button"
              role="tab"
              aria-controls="profile-tab-pane"
              aria-selected="false"
            >
              반품/교환정보
            </button>
          </li>
          <li className="nav-item" role="presentation">
            <button
              className="nav-link"
              id="contact-tab"
              data-bs-toggle="tab"
              data-bs-target="#contact-tab-pane"
              type="button"
              role="tab"
              aria-controls="contact-tab-pane"
              aria-selected="false"
            >
              리뷰
            </button>
          </li>
        </ul>
        <div className="tab-content" id="myTabContent">
          <div
            className="tab-pane fade show active"
            id="home-tab-pane"
            role="tabpanel"
            aria-labelledby="home-tab"
            tabIndex={0}
          >
            안녕하세요, {product.title}입니다.
          </div>
          <div
            className="tab-pane fade"
            id="profile-tab-pane"
            role="tabpanel"
            aria-labelledby="profile-tab"
            tabIndex={0}
          >
            반품/교환정보
          </div>
          <div
            className="tab-pane fade"
            id="contact-tab-pane"
            role="tabpanel"
            aria-labelledby="contact-tab"
            tabIndex={0}
          >
            리뷰탭
          </div>
        </div>
      </div>
    </div>
  );
}
