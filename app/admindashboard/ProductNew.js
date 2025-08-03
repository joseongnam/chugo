"use client";

import "bootstrap/dist/css/bootstrap.min.css";
import { useState } from "react";

export default function ProductNew() {
  const [on, setOn] = useState(false);
  const [imageUrl, setImageUrl] = useState("");

  return (
    <div className="col-md-12">
      <div className="card shadow">
        <div className="card-body">
          <h5 className="card-title">상품 등록</h5>
          {on ? (
            <form>
              <div className="row">
                <div className="col-md-6 mb-3">
                  <label className="form-label">상품이름</label>
                  <input type="text" className="form-control" />
                </div>

                <div className="col-md-6 mb-3">
                  <label className="form-label">상품설명</label>
                  <input type="text" className="form-control" />
                </div>

                <div className="col-md-6 mb-3">
                  <label className="form-label">가격</label>
                  <input type="number" className="form-control" />
                </div>

                <div className="col-md-6 mb-3">
                  <label className="form-label">재고수량</label>
                  <input type="number" className="form-control" />
                </div>

                <div className="col-md-6 mb-3">
                  <label className="form-label">옵션</label>
                  <input type="text" className="form-control" />
                </div>

                <div className="col-md-6 mb-3">
                  <label className="form-label">판매여부</label>
                  <input type="text" className="form-control" />
                </div>

                <div className="col-md-6 mb-3">
                  <label className="form-label">할인율</label>
                  <input type="number" className="form-control" />
                </div>

                <div className="col-md-6 mb-3">
                  <label className="form-label">태그</label>
                  <input type="text" className="form-control" />
                </div>

                {/* 이미지 URL 입력 */}
                <div className="col-md-6 mb-3">
                  <label className="form-label">이미지 URL</label>
                  <input
                    type="text"
                    className="form-control"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                  />
                </div>

                {/* 이미지 미리보기 */}
                <div className="col-md-6 mb-3">
                  <label className="form-label">이미지 미리보기</label>
                  <div className="border p-2 text-center" style={{ minHeight: "150px" }}>
                    {imageUrl ? (
                      <img
                        src={imageUrl}
                        alt="미리보기"
                        style={{ maxWidth: "100%", maxHeight: "140px" }}
                      />
                    ) : (
                      <div className="text-muted">이미지 없음</div>
                    )}
                  </div>
                </div>

                {/* 이미지 업로드 (향후 파일 직접 업로드 구현용 버튼) */}
                <div className="col-12 mb-3">
                  <label className="form-label">이미지 업로드</label>
                  <input type="file" className="form-control" />
                </div>
              </div>

              <div className="d-flex gap-2">
                <button type="submit" className="btn btn-primary">
                  등록
                </button>
                <button
                  type="button"
                  className="btn btn-outline-danger"
                  onClick={() => setOn(false)}
                >
                  닫기
                </button>
              </div>
            </form>
          ) : (
            <button className="btn btn-primary" onClick={() => setOn(true)}>
              + 새 상품 등록
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
