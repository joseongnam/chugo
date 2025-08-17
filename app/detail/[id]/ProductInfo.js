"use client";

import { useState } from "react";

export default function ProductInfo({ product }) {
  const [activeTab, setActiveTab] = useState("info");

  const handleTabChange = (tab) => {};

  return (
    <div className="product-info">
      <ul className="nav nav-tabs" id="myTab" role="tablist">
        <li className="nav-item" role="presentation">
          <button
            className={`nav-link ${activeTab === "info" ? "active" : ""}`}
            id="home-tab"
            data-bs-toggle="tab"
            data-bs-target="#home-tab-pane"
            type="button"
            role="tab"
            aria-controls="home-tab-pane"
            aria-selected="true"
            onClick={() => {
              setActiveTab("info");
            }}
          >
            상세정보
          </button>
        </li>
        <li className="nav-item" role="presentation">
          <button
            className={`nav-link ${activeTab === "profile" ? "active" : ""}`}
            id="profile-tab"
            data-bs-toggle="tab"
            data-bs-target="#profile-tab-pane"
            type="button"
            role="tab"
            aria-controls="profile-tab-pane"
            aria-selected="false"
            onClick={() => {
              setActiveTab("profile");
            }}
          >
            반품/교환정보
          </button>
        </li>
        <li className="nav-item" role="presentation">
          <button
            className={`nav-link ${activeTab === "review" ? "active" : ""}`}
            id="contact-tab"
            data-bs-toggle="tab"
            data-bs-target="#contact-tab-pane"
            type="button"
            role="tab"
            aria-controls="contact-tab-pane"
            aria-selected="false"
            onClick={() => {
              setActiveTab("review");
            }}
          >
            리뷰
          </button>
        </li>
      </ul>
      <div className="tab-content" id="myTabContent">
        <div
          className={`tab-pane fade ${
            activeTab === "info" ? "show active" : ""
          }`}
          id="home-tab-pane"
          role="tabpanel"
          aria-labelledby="home-tab"
          tabIndex={0}
        >
          안녕하세요, {product.title}입니다.
        </div>
        <div
          className={`tab-pane fade ${
            activeTab === "profile" ? "show active" : ""
          }`}
          id="profile-tab-pane"
          role="tabpanel"
          aria-labelledby="profile-tab"
          tabIndex={0}
        >
          반품/교환정보
        </div>
        <div
          className={`tab-pane fade ${
            activeTab === "review" ? "show active" : ""
          }`}
          id="contact-tab-pane"
          role="tabpanel"
          aria-labelledby="contact-tab"
          tabIndex={0}
        >
          리뷰탭
        </div>
      </div>
    </div>
  );
}
