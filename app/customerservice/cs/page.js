"use client";

import { views } from "@/app/actions";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Cs() {
  const [List, setList] = useState([]);
  const [searchInput, setSearchInput] = useState(""); // input 값
  const [filteredList, setFilteredList] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [limit, setLimit] = useState(5);
  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);
  const [totalWrite, setTotalWrite] = useState(0);
  const router = useRouter();
  const [totalComment, setTotalComment] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // ✅ try...catch 블록으로 에러 처리
        const response = await fetch(
          `/api/cs/list?page=${page}&limit=${limit}`
        );
        if (!response.ok) {
          throw new Error("네트워크 응답이 올바르지 않습니다.");
        }
        const data = await response.json();
        setList(data.data);
        setFilteredList(data.data);
        setTotalPages(data.totalPages);
        setTotalWrite(data.totalWrite);
      } catch (error) {
        console.error("데이터를 불러오는 중 오류 발생:", error);
        setList([]);
        setFilteredList([]);
      }
    };
    fetchData();
  }, [page]);
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

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      handleSearch();
    }
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
              onKeyDown={handleKeyDown}
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
            {filteredList.map((data, index) => {
              const number = totalWrite - ((page - 1) * limit + index);
              return (
                <tr key={index} className="write-tr">
                  <td>{number}</td>
                  <td
                    className="td-title"
                    onClick={() => {
                      router.push(`/customerservice/cs/detail/${data._id}`);
                      views(data._id);
                    }}
                  >
                    {data.title}
                    {data.totalComment === 0 ? "" : ` (${data.totalComment})`}
                  </td>
                  <td>{data.date}</td>
                  <td>{data.name}</td>
                  <td>{data.views}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
        <div className="cs-end">
          <div>
            <button
              onClick={() => {
                setPage(1);
              }}
            >
              첫페이지
            </button>
          </div>
          <div className="page-number">
            <button
              onClick={() => {
                setPage(page - 1);
              }}
            >
              &lt;
            </button>
            {pageNumbers.map((a, i) => (
              <button
                key={i}
                onClick={() => {
                  setPage(a);
                }}
              >
                {a}
              </button>
            ))}
            <button
              onClick={() => {
                setPage(page + 1);
              }}
            >
              &gt;
            </button>
          </div>
          <div>
            <button
              onClick={() => {
                setPage(totalPages);
              }}
            >
              마지막페이지
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
