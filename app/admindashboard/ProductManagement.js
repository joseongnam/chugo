"use client";

import "bootstrap/dist/css/bootstrap.min.css";
import { useEffect, useState } from "react";

export default function ProductManagement() {
  const [on, setOn] = useState(false);
  const [editon, setEditon] = useState(null);
  const [products, setProducts] = useState([]); // 초기값 배열
  const [imageUrl, setImageUrl] = useState("");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [price, setPrice] = useState("");
  const [inventory, setInventory] = useState("");
  const [category, setCategory] = useState("");
  const [status, setStatus] = useState("");
  const [discount, setDiscount] = useState("");
  const [tag, setTag] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("/api/post/list");
        const data = await res.json();
        // 배열인지 확인 후 상태 업데이트
        console.log(data);
        setProducts(Array.isArray(data.products) ? data.products : []);
      } catch (err) {
        console.error("상품 불러오기 실패:", err);
      }
    };
    fetchData();
  }, []);

  const productEdit = (item) => {
    setTitle(item.title);
    setContent(item.content);
    setPrice(item.price);
    setInventory(item.inventory);
    setCategory(item.category);
    setStatus(item.status);
    setDiscount(item.discount);
    setTag(item.tag);
    setImageUrl(item.imageUrl || "");
  };

  const handleDelete = (id) => {
    fetch(`/api/delete/${id}`, { method: "DELETE" })
      .then((res) => res.json())
      .then((data) => {
        console.log("삭제 완료:", data);
        alert("삭제완료!");
        setProducts(products.filter((p) => p._id !== id));
      });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);

    const res = await fetch(`/api/edit/${editon}`, {
      method: "PUT",
      body: formData,
    });

    const result = await res.json();
    alert("수정완료");
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
          <h5 className="card-title">상품 관리</h5>
          <div className={`formdata ${on ? "show" : ""}`}>
            <div className="form-container-product">
              <div className="product-form">
                {products.map((item, index) => (
                  <div key={index} className="product-can wide">
                    <input
                      type="radio"
                      name="selectedProduct"
                      id={`product-${index}`}
                      className="user-radio"
                    />
                    <label
                      htmlFor={`product-${index}`}
                      className="product-label"
                    >
                      {item.title}
                    </label>
                    {editon !== item._id ? (
                      <>
                        <button
                          type="button"
                          className="btn btn-outline-secondary"
                          onClick={() => {
                            productEdit(item);
                            setEditon(item._id);
                          }}
                        >
                          수정
                        </button>
                        <button
                          type="button"
                          className="btn btn-outline-danger"
                          onClick={() => handleDelete(item._id)}
                        >
                          삭제
                        </button>
                      </>
                    ) : null}
                    {editon === item._id && (
                      <div className="product-edit">
                        <form
                          className="productNewForm"
                          onSubmit={handleSubmit}
                        >
                          <div className="row">
                            <div className="col-md-6 mb-3">
                              <label className="form-label">상품이름</label>
                              <input
                                type="text"
                                className="form-control"
                                name="title"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                              />
                            </div>

                            <div className="col-md-6 mb-3">
                              <label className="form-label">상품설명</label>
                              <input
                                type="text"
                                className="form-control"
                                name="content"
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                              />
                            </div>

                            <div className="col-md-6 mb-3">
                              <label className="form-label">가격</label>
                              <input
                                type="number"
                                className="form-control"
                                name="price"
                                value={price}
                                onChange={(e) => setPrice(e.target.value)}
                              />
                            </div>

                            <div className="col-md-6 mb-3">
                              <label className="form-label">재고수량</label>
                              <input
                                type="number"
                                className="form-control"
                                name="inventory"
                                value={inventory}
                                onChange={(e) => setInventory(e.target.value)}
                              />
                            </div>

                            <div className="col-md-6 mb-3">
                              <label className="form-label">옵션</label>
                              <select name="category" required>
                                <option value={category}>{category}</option>
                                <option value="clothing">의류</option>
                                <option value="electronics">전자기기</option>
                                <option value="food">식품</option>
                              </select>
                            </div>

                            <div className="col-md-6 mb-3">
                              <label className="form-label">판매여부</label>
                              <select name="status" required>
                                <option value={status}>{status}</option>
                                <option value="for-sale">판매중</option>
                                <option value="completed">판매완료</option>
                                <option value="stop">판매중지</option>
                              </select>
                            </div>

                            <div className="col-md-6 mb-3">
                              <label className="form-label">할인율</label>
                              <input
                                type="number"
                                className="form-control"
                                name="discount"
                                value={discount}
                                onChange={(e) => setDiscount(e.target.value)}
                              />
                            </div>

                            <div className="col-md-6 mb-3">
                              <label className="form-label">태그</label>
                              <input
                                type="text"
                                className="form-control"
                                name="tag"
                                value={tag}
                                onChange={(e) => setTag(e.target.value)}
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
                              <label className="form-label">
                                이미지 미리보기
                              </label>
                              <div
                                className="border p-2 text-center"
                                style={{ minHeight: "150px" }}
                              >
                                {imageUrl ? (
                                  <img
                                    src={imageUrl}
                                    alt="미리보기"
                                    style={{
                                      maxWidth: "100%",
                                      maxHeight: "140px",
                                    }}
                                  />
                                ) : (
                                  <div className="text-muted">이미지 없음</div>
                                )}
                              </div>
                            </div>

                            {/* 이미지 업로드 */}
                            <div className="col-12 mb-3">
                              <label className="form-label">
                                이미지 업로드
                              </label>
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
                            <button
                              type="button"
                              className="btn btn-outline-danger"
                              onClick={() => setEditon(null)}
                            >
                              닫기
                            </button>
                          </div>
                        </form>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="d-flex flex-wrap gap-2">
            {!on ? (
              <button className="btn btn-primary" onClick={() => setOn(true)}>
                List
              </button>
            ) : (
              <>
                <button
                  className="btn btn-outline-danger"
                  onClick={() => setOn(false)}
                >
                  닫기
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
