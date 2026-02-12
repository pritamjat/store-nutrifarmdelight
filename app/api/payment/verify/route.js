import { NextResponse } from "next/server";
import crypto from "crypto";

export async function POST(request) {
  try {
    const body = await request.json();

    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    } = body;

    const generatedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(razorpay_order_id + "|" + razorpay_payment_id)
      .digest("hex");

    if (generatedSignature !== razorpay_signature) {
      return NextResponse.json(
        { message: "Invalid signature" },
        { status: 400 }
      );
    }

    // 🔥 DO NOT update DB here
    return NextResponse.json({ message: "Payment verified" });

  } catch (error) {
    return NextResponse.json(
      { message: "Verification failed" },
      { status: 500 }
    );
  }
}
