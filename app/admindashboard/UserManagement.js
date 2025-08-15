"use client";

import "bootstrap/dist/css/bootstrap.min.css";
import { useEffect, useState } from "react";

export default function UserManagement() {
  const [on, setOn] = useState(false);
  const [users, setUsers] = useState([]); // 초기값 배열

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("/api/user/list");
        const data = await res.json();
        // 배열인지 확인 후 상태 업데이트
        console.log(data);
        setUsers(Array.isArray(data.users) ? data.users : []);
      } catch (err) {
        console.error("유저 불러오기 실패:", err);
      }
    };
    fetchData();
  }, []);
  return (
    <div className="col-md-12">
      <div className="card shadow">
        <div className="card-body">
          <h5 className="card-title">유저 관리</h5>
          <div className={`formdata ${on ? "show" : ""}`}>
            <div className="form-container-product">
              <form className="product-form">
                {users.map((item, index) => (
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
                      이름 : {item.name} 이메일 : {item.email}
                    </label>
                    <button className="btn btn-outline-secondary">수정</button>
                    <button className="btn btn-outline-danger">삭제</button>
                  </div>
                ))}
              </form>
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
