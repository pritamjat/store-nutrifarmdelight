import { NextResponse } from "next/server";
import crypto from "crypto";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export async function POST(request) {
  try {
    const body = await request.json();

    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, dbOrderId } = body;

    const generatedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(razorpay_order_id + "|" + razorpay_payment_id)
      .digest("hex");

    if (generatedSignature !== razorpay_signature) {
      return NextResponse.json({ message: "Invalid signature" }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db();
    const orders = db.collection("orders");
    const users = db.collection("users");

    await orders.updateOne(
      { _id: new ObjectId(dbOrderId) },
      { $set: { status: "paid" } }
    );

    // Clear cart
    await users.updateOne(
      { _id: new ObjectId(body.userId) },
      { $set: { cart: [] } }
    );

    return NextResponse.json({ message: "Payment verified" });

  } catch (error) {
    return NextResponse.json({ message: "Verification failed" }, { status: 500 });
  }
}

