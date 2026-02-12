import { NextResponse } from "next/server";
import crypto from "crypto";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export async function POST(request) {
  try {
    const rawBody = await request.text();
    const signature = request.headers.get("x-razorpay-signature");

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_WEBHOOK_SECRET)
      .update(rawBody)
      .digest("hex");

    if (signature !== expectedSignature) {
      return NextResponse.json({ message: "Invalid signature" }, { status: 400 });
    }

    const event = JSON.parse(rawBody);

    if (event.event === "payment.captured") {
      const razorpayOrderId = event.payload.payment.entity.order_id;

      const client = await clientPromise;
      const db = client.db();
      const orders = db.collection("orders");
      const users = db.collection("users");

      const order = await orders.findOne({ razorpayOrderId });

      if (!order || order.status === "paid") {
        return NextResponse.json({ status: "already processed" });
      }

      // 🔥 Update order status
      await orders.updateOne(
        { _id: order._id },
        { $set: { status: "paid" } }
      );

      // 🔥 Clear cart
      await users.updateOne(
        { _id: new ObjectId(order.userId) },
        { $set: { cart: [] } }
      );
    }

    return NextResponse.json({ status: "ok" });

  } catch (error) {
    return NextResponse.json({ message: "Webhook error" }, { status: 500 });
  }
}
