import Razorpay from "razorpay";
import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { verifyToken } from "@/lib/auth";
import { cookies } from "next/headers";
import { ObjectId } from "mongodb";

export async function POST() {
  try {
    const cookieStore = cookies();
    const token = cookieStore.get("auth_token")?.value;

    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const userData = await verifyToken(token);

    const client = await clientPromise;
    const db = client.db();
    const users = db.collection("users");
    const orders = db.collection("orders");

    const user = await users.findOne({
      _id: new ObjectId(userData.sub),
    });

    if (!user.cart || user.cart.length === 0) {
      return NextResponse.json({ message: "Cart empty" }, { status: 400 });
    }

    const total = user.cart.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });

    const razorpayOrder = await razorpay.orders.create({
      amount: total * 100, // paisa
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
    });

    // Save order in DB with status = created
    const dbOrder = await orders.insertOne({
      userId: new ObjectId(userData.sub),
      items: user.cart,
      total,
      status: "created",
      razorpayOrderId: razorpayOrder.id,
      createdAt: new Date(),
    });

    return NextResponse.json({
      razorpayOrder,
      dbOrderId: dbOrder.insertedId,
      key: process.env.RAZORPAY_KEY_ID,
    });

  } catch (error) {
    return NextResponse.json(
      { message: "Payment error" },
      { status: 500 }
    );
  }
}
