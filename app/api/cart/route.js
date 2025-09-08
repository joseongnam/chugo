import connectDB from "@/util/database";
import { ObjectId } from "mongodb";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export async function POST(req) {
  const { ids } = await req.json();
  const objectIds = ids.map((id) => new ObjectId(id));
  const db = (await connectDB).db("chugo");
  const cartItems = await db
    .collection("products")
    .find({ _id: { $in: objectIds } })
    .toArray();

  const items = cartItems.map((item) => {
    return {
      ...item,
      _id: item._id.toString(),
      createdAt: item.createdAt ? item.createdAt.toISOString() : null,
      updatedAt: item.updatedAt ? item.updatedAt.toISOString() : null,
    };
  });
  return NextResponse.json(items);
}
