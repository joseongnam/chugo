import connectDB from "@/util/database";

// POST 핸들러 (App Router 방식)
export async function POST(request) {
  const { imp_uid, merchant_uid, orderData } = await request.json();
  const phone = `${orderData.phone1}-${orderData.phone2}-${orderData.phone3}`;
  const rephone = `${orderData.rephone1}-${orderData.rephone2}-${orderData.rephone3}`;
  const address = `${orderData.address1} ${orderData.address2}`;
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
    const tokenData = await tokenRes.json();
    if (!tokenData.response) throw new Error("Iamport 토큰 발급 실패");
    const token = tokenData.response;

    // 2) 결제 내역 조회
    const paymentRes = await fetch(
      `https://api.iamport.kr/payments/${imp_uid}`,
      {
        headers: { Authorization: token.access_token },
      }
    );
    const paymentData = await paymentRes.json();
    if (!paymentData.response) throw new Error("결제 조회 실패");
    const payment = paymentData.response;

    // 3) 결제 검증
    if (!payment) {
      return new Response(JSON.stringify({ error: "결제 정보 조회 실패" }), {
        status: 400,
      });
    }

    if (payment.status !== "paid") {
      return new Response(JSON.stringify({ error: "결제 실패" }), {
        status: 400,
      });
    }
    if (payment.amount !== orderData.totalPrice) {
      return new Response(JSON.stringify({ error: "금액 불일치" }), {
        status: 400,
      });
    }

    const result = await db.collection("order").insertOne({
      name: orderData.name,
      phone: phone,
      receiver: orderData.receiver,
      rephone: rephone,
      deliveryMessage: orderData.deliveryMessage,
      zipcode: orderData.zipcode,
      address: address,
      deliveryMessage: orderData.deliveryMessage,
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
    return new Response(
      JSON.stringify({ error: err.message || "서버 오류 발생" }),
      {
        status: 500,
      }
    );
  }
}
