import "bootstrap/dist/css/bootstrap.min.css";

export default function ProductManagement() {
  return (
    <div className="col-md-6">
      <div className="card shadow">
        <div className="card-body">
          <h5 className="card-title">상품 관리</h5>
          <div className="d-flex flex-wrap gap-2">
            <button className="btn btn-outline-secondary">사진 업로드</button>
            <button className="btn btn-outline-secondary">사진 수정</button>
            <button className="btn btn-outline-secondary">
              상품 정보 수정
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
