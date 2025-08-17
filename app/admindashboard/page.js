import connectDB from "@/util/database";
import "bootstrap/dist/css/bootstrap.min.css";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import AdManagement from "./AdManagement";
import ProductManagement from "./ProductManagement";
import ProductNew from "./ProductNew";
import UserManagement from "./UserManagement";

const SECRET_KEY = process.env.JWT_SECRET;

export default async function AdminDashboard() {
  let db = (await connectDB).db("chugo");
  let products = await db.collection("products").find().toArray();

  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) {
    redirect("/login");
  }

  try {
    const decoded = jwt.verify(token, SECRET_KEY);

    if (decoded.isAdmin !== true && decoded.isAdmin !== "true") {
      redirect("/");
    }
  } catch (err) {
    redirect("/login");
  }

  return (
    <div className="container py-5 bg-white min-vh-100">
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
