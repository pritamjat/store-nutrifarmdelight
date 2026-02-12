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
      return NextResponse.json({ message: "Cart is empty" }, { status: 400 });
    }

    const total = user.cart.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    // Create order
    await orders.insertOne({
      userId: new ObjectId(userData.sub),
      items: user.cart,
      total,
      status: "pending",
      createdAt: new Date(),
    });

    // Clear cart
    await users.updateOne(
      { _id: new ObjectId(userData.sub) },
      { $set: { cart: [] } }
    );

    return NextResponse.json({ message: "Order created" });

  } catch (error) {
    return NextResponse.json(
      { message: "Error creating order" },
      { status: 500 }
    );
  }
}


