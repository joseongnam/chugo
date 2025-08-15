import connectDB from "@/util/database";
import Card from "./component/Card";

export default async function AllProducts() {
  let db = (await connectDB).db("chugo");
  let productsRaw = await db.collection("products").find().toArray();
  const products = productsRaw.map((item) => ({
    ...item,
    _id: item._id.toString(),
    productId: item.productId?.toString?.() ?? null,
    createdAt: item.createdAt?.toString?.(),
  }));

  return (
    <div className="sale-products">
      <div className="product-row">
        {products.slice(0, 8).map((item, i) => {
          return (
            <Card
              key={i}
              title={item.title}
              content={item.content}
              price={item.price}
              discount={item.discount}
              imageUrl={item.imageUrl}
              id={item._id}
            />
          );
        })}
      </div>
    </div>
  );
}
