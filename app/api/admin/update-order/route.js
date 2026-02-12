import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth";
import { ObjectId } from "mongodb";

export async function POST(request) {
  try {
    const cookieStore = cookies();
    const token = cookieStore.get("auth_token")?.value;

    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const user = await verifyToken(token);

    if (user.role !== "admin") {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    const { orderId, status, trackingNumber } = await request.json();

    const client = await clientPromise;
    const db = client.db();
    const orders = db.collection("orders");

    const order = await orders.findOne({
      _id: new ObjectId(orderId),
    });

    if (!order) {
      return NextResponse.json({ message: "Order not found" }, { status: 404 });
    }

    const allowedTransitions = {
      paid: ["packed"],
      packed: ["shipped"],
      shipped: ["delivered"],
      delivered: [],
    };

    const currentStatus = order.status;

    if (!allowedTransitions[currentStatus]?.includes(status)) {
      return NextResponse.json(
        { message: "Invalid status transition" },
        { status: 400 }
      );
    }

    const updateData = { status };

    if (status === "shipped" && trackingNumber) {
      updateData.trackingNumber = trackingNumber;
    }

    await orders.updateOne(
      { _id: new ObjectId(orderId) },
      { $set: updateData }
    );

    return NextResponse.json({ message: "Order updated" });

  } catch (error) {
    return NextResponse.json({ message: "Error" }, { status: 500 });
  }
}
