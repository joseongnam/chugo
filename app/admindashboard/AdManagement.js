"use client";

import "bootstrap/dist/css/bootstrap.min.css";
import { useState } from "react";

export default function AdManagement() {
  const [on, setOn] = useState(false);
  const [imageUrl, setImageUrl] = useState(""); // 초기값 빈 문자열로 변경

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);

    const res = await fetch("/api/ad/new", {
      method: "POST",
      body: formData,
    });

    const result = await res.json();
    alert(result.title + "등록완료");
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      setImageUrl(e.target.result); // 이미지 데이터 URL을 상태에 저장
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="col-md-12">
      <div className="card shadow">
        <div className="card-body">
          <h5 className="card-title">광고 관리</h5>
          <div className={`formdata ${on ? "show" : ""}`}>
            <form className="productNewForm" onSubmit={handleSubmit}>
              <div className="row">
                <div className="col-md-6 mb-3">
                  <label className="form-label">광고이름</label>
                  <input type="text" className="form-control" name="title" />
                </div>

                <div className="col-md-6 mb-3">
                  <label className="form-label">연결제품선택</label>
                  <input
                    type="text"
                    className="form-control"
                    name="productId"
                  />
                </div>

                {/* 이미지 URL 입력 */}
                <div className="col-md-6 mb-3">
                  <label className="form-label">이미지 URL</label>
                  <input
                    type="text"
                    className="form-control"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    placeholder="이미지 주소 직접 입력 가능"
                  />
                </div>

                {/* 이미지 미리보기 */}
                <div className="col-md-6 mb-3">
                  <label className="form-label">이미지 미리보기</label>
                  <div
                    className="border p-2 text-center"
                    style={{ minHeight: "150px" }}
                  >
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

                {/* 이미지 업로드 */}
                <div className="col-12 mb-3">
                  <label className="form-label">이미지 업로드</label>
                  <input
                    type="file"
                    className="form-control"
                    name="image"
                    accept="image/*"
                    onChange={handleImageChange}
                  />
                </div>
              </div>

              <div className="d-flex gap-2">
                <button type="submit" className="btn btn-primary">
                  등록
                </button>
                <button type="submit" className="btn btn-outline-secondary">
                  수정
                </button>
                <button className="btn btn-outline-danger">삭제</button>

                <button
                  type="button"
                  className="btn btn-outline-danger"
                  onClick={() => setOn(false)}
                >
                  닫기
                </button>
              </div>
            </form>
          </div>
          <button
            className={`${on ? "hidden" : "btn btn-primary"}`}
            onClick={() => setOn(true)}
          >
            + 등록
          </button>
        </div>
      </div>
    </div>
  );
}
