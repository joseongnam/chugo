import connectDB from "@/util/database";
import OrderDetail from "./OrderDetail";

export default async function Order() {
  const db = (await connectDB).db("chugo");
  const productRaw = await db.collection("products").find().toArray();
  const products = productRaw.map((item) => ({
    ...item,
    _id: item._id.toString(),
    createdAt: item.createdAt ? item.createdAt.toISOString() : null,
    updatedAt: item.updatedAt ? item.updatedAt.toISOString() : null,
  }));
  
  return (
    <div className="order-background order-page">
      <div className="up-nav">
        <div>&lt;</div>
        <div>YOGO</div>
        <div>
          <span>
            <i className="bi bi-bag"></i>
          </span>
          <span>
            <i className="bi bi-person"></i>
          </span>
        </div>
      </div>
      <OrderDetail products={products} />
    </div>
  );
}
