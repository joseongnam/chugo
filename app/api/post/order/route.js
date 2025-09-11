import connectDB from "@/util/database";

// POST 핸들러 (App Router 방식)
export async function POST(request) {
  const {
    name,
    phone1,
    phone2,
    phone3,
    receiver,
    address1,
    address2,
    zipcode,
    rephone1,
    rephone2,
    rephone3,
    deliveryMessage,
    imp_uid,
    merchant_uid,
    orderData
  } = await request.json();
  const phone = `${phone1}-${phone2}-${phone3}`;
  const rephone = `${rephone1}-${rephone2}-${rephone3}`;
  const address = `${address1} ${address2}`;
  const db = (await connectDB).db("chugo");

  try {
    if (!name || !phone || !receiver || !rephone || !zipcode || !address) {
      return new Response(JSON.stringify({ error: "입력값 부족" }), {
        status: 400,
      });
    }

    const tokenRes = await fetch("https://api.iamport.kr/users/getToken", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        imp_key: process.env.IMP_KEY,
        imp_secret: process.env.IMP_SECRET,
      }),
    });
    const { response: token } = await tokenRes.json();

    // 2) 결제 내역 조회
    const paymentRes = await fetch(
      `https://api.iamport.kr/payments/${imp_uid}`,
      {
        headers: { Authorization: token.access_token },
      }
    );
    const { response: payment } = await paymentRes.json();

    // 3) 결제 검증
    if (payment.status !== "paid") {
      return NextResponse.json({ error: "결제 실패" }, { status: 400 });
    }
    if (payment.amount !== orderData.totalPrice) {
      return NextResponse.json({ error: "금액 불일치" }, { status: 400 });
    }

    const result = await db.collection("order").insertOne({
      name: name,
      phone: phone,
      receiver: receiver,
      rephone: rephone,
      deliveryMessage: deliveryMessage,
      zipcode: zipcode,
      address: address,
      amount: payment.amount,
      status: "paid",
      createdAt: new Date(),
    });

    return new Response(
      JSON.stringify({ message: "주문완료", redirect: "/order/success" }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (err) {
    console.error("주문 실패", err);
    return new Response(JSON.stringify({ error: "서버 오류 발생" }), {
      status: 500,
    });
  }
}
