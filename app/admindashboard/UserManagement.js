import "bootstrap/dist/css/bootstrap.min.css";

export default function UserManagement() {
  return (
    <div className="col-md-6">
          <div className="card shadow">
            <div className="card-body">
              <h5 className="card-title">유저 관리</h5>
              <div className="d-flex flex-wrap gap-2">
                <button className="btn btn-outline-secondary">
                  유저 정보 보기
                </button>
                <button className="btn btn-outline-danger">탈퇴 처리</button>
              </div>
            </div>
          </div>
        </div>
  );
}
