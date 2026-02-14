import Razorpay from "razorpay";
import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { verifyToken } from "@/lib/auth";
import { cookies } from "next/headers";
import { ObjectId } from "mongodb";

export async function POST(request) {
  try {
    const cookieStore = cookies();
    const token = cookieStore.get("auth_token")?.value;

    if (!token) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    const userData = await verifyToken(token);

    // 🔥 READ ADDRESS FROM BODY
    const body = await request.json();
    const address = body.address;

    if (!address) {
      return NextResponse.json(
        { message: "Address missing" },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db();
    const users = db.collection("users");
    const orders = db.collection("orders");

    const user = await users.findOne({
      _id: new ObjectId(userData.sub),
    });

    if (!user || !user.cart || user.cart.length === 0) {
      return NextResponse.json(
        { message: "Cart empty" },
        { status: 400 }
      );
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
      amount: total * 100,
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
    });

    // 🔥 SAVE ADDRESS INSIDE ORDER
    const dbOrder = await orders.insertOne({
      userId: new ObjectId(userData.sub),
      items: user.cart,
      total,
      status: "created",
      razorpayOrderId: razorpayOrder.id,
      address: {
        fullName: address.fullName,
        phone: address.phone,
        line1: address.line1,
        city: address.city,
        state: address.state,
        pincode: address.pincode,
      },
      createdAt: new Date(),
    });

    return NextResponse.json({
      razorpayOrder,
      dbOrderId: dbOrder.insertedId,
      key: process.env.RAZORPAY_KEY_ID,
    });

  } catch (error) {
    console.error("CREATE ORDER ERROR:", error);
    return NextResponse.json(
      { message: "Payment error" },
      { status: 500 }
    );
  }
}
