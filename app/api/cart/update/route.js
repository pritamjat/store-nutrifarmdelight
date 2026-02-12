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
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const userData = await verifyToken(token);
    const { productId, action } = await request.json();

    const cleanProductId = productId.toString(); // 🔥 always string

    const client = await clientPromise;
    const db = client.db();
    const users = db.collection("users");

    if (action === "increase") {
      await users.updateOne(
        {
          _id: new ObjectId(userData.sub),
          "cart.productId": cleanProductId,
        },
        {
          $inc: { "cart.$.quantity": 1 },
        }
      );
    }

    if (action === "decrease") {
      // First decrease quantity
      await users.updateOne(
        {
          _id: new ObjectId(userData.sub),
          "cart.productId": cleanProductId,
        },
        {
          $inc: { "cart.$.quantity": -1 },
        }
      );

      // Then remove if quantity <= 0
      await users.updateOne(
        { _id: new ObjectId(userData.sub) },
        {
          $pull: {
            cart: {
              productId: cleanProductId,
              quantity: { $lte: 0 },
            },
          },
        }
      );
    }

    return NextResponse.json({ message: "Cart updated" });

  } catch (error) {
    return NextResponse.json(
      { message: "Error updating cart" },
      { status: 500 }
    );
  }
}
