"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Cs() {
  const [List, setList] = useState([]);
  const [searchInput, setSearchInput] = useState(""); // input 값
  const [filteredList, setFilteredList] = useState([]);

  const router = useRouter();
  useEffect(() => {
    const fetchData = async () => {
      try {
        // ✅ try...catch 블록으로 에러 처리
        const response = await fetch("/api/cs/list");
        if (!response.ok) {
          throw new Error("네트워크 응답이 올바르지 않습니다.");
        }
        const data = await response.json();
        setList(data.data.reverse());
        setFilteredList(data.data.reverse());
      } catch (error) {
        console.error("데이터를 불러오는 중 오류 발생:", error);
        setList([]);
        setFilteredList([]);
      }
    };
    fetchData();
  }, []);
  console.log(List);

  const handleSearch = () => {
    const keyword = searchInput.trim();
    if (!keyword) {
      setFilteredList(List); // 검색어 없으면 전체 보여줌
      return;
    }
    const result = List.filter((item) => item.title.includes(keyword));
    setFilteredList(result);
  };

  return (
    <div className="cs-container table">
      <div>
        <div className="cs-up">
          <div>
            <button
              className="write-btn"
              onClick={() => {
                router.push("/customerservice/cs/write");
              }}
            >
              글쓰기
            </button>
          </div>
          <div className="cs-search">
            <input
              type="text"
              onChange={(e) => setSearchInput(e.target.value)}
            />
            <button onClick={handleSearch}>검색</button>
          </div>
        </div>
        <table>
          <thead>
            <tr>
              <th className="table-number">번호</th>
              <th className="table-title">제목</th>
              <th className="table-time">시간</th>
              <th className="table-author">작성자</th>
              <th className="table-views">조회수</th>
            </tr>
          </thead>
          <tbody>
            {filteredList.map((data, index) => (
              <tr key={index}>
                <td>{List.length - index}</td>
                <td className="td-title">{data.title}</td>
                <td>{data.date}</td>
                <td>{data.email}</td>
                <td>100</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="cs-end">
          <div>
            <button>첫페이지</button>
          </div>
          <div className="page-number">
            <button>&lt;</button>
            <button>1</button>
            <button>2</button>
            <button>&gt;</button>
          </div>
          <div>
            <button>마지막페이지</button>
          </div>
        </div>
      </div>
    </div>
  );
}
