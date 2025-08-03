import "bootstrap/dist/css/bootstrap.min.css";

export default function AdManagement() {
  return (
    <div className="col-md-6">
      <div className="card shadow">
        <div className="card-body">
          <h5 className="card-title">광고 관리</h5>
          <div className="d-flex flex-wrap gap-2">
            <button className="btn btn-outline-secondary">광고 등록</button>
            <button className="btn btn-outline-secondary">
              광고 이미지 수정
            </button>
            <button className="btn btn-outline-danger">광고 삭제</button>
          </div>
        </div>
      </div>
    </div>
  );
}
