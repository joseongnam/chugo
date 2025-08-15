import connectDB from "@/util/database";
import AdSlider from "./AdSlider";
import AllProducts from "./AllProducts";


export default async function home() {
  let db = (await connectDB).db("chugo");
  let adRaw = await db.collection("ad").find().toArray();
  const ad = adRaw.map((item) => ({
    ...item,
    _id: item._id.toString(),
    createdAt: item.createdAt?.toString?.(),
  }));

  return (
    <div>
      <AdSlider ad={ad} />
      <AllProducts />
      <div>사진한장광고</div>
      <div>새로운상품 4개씩 슬라이드</div>
      <div>적립금,할인</div>
    </div>
  );
}
