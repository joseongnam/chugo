import { connectDB } from "@/utill/database";
import "bootstrap/dist/css/bootstrap.min.css";
import AdManagement from "./AdManagement";
import ProductManagement from "./ProductManagement";
import ProductNew from "./ProductNew";
import UserManagement from "./UserManagement";

export default async function AdminDashboard() {
  let db = (await connectDB).db("chugo");
  let products = await db.collection("products").find().toArray();

  return (
    <div className="container py-5 bg-light min-vh-100">
      <div className="row g-4">
        {/* 상품 등록 */}
        <ProductNew />
        {/* 상품 관리 */}
        <ProductManagement />

        {/* 유저 관리 */}
        <UserManagement />

        {/* 광고 관리 */}
        <AdManagement />
      </div>
    </div>
  );
}
