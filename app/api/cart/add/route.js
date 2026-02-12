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

    const { productId } = await request.json();

    if (!productId || !ObjectId.isValid(productId)) {
      return NextResponse.json(
        { message: "Invalid product ID" },
        { status: 400 }
      );
    }

    const userId = new ObjectId(userData.sub);
    const productObjectId = new ObjectId(productId);

    const client = await clientPromise;
    const db = client.db();
    const users = db.collection("users");
    const products = db.collection("products");

    const user = await users.findOne({ _id: userId });

    if (!user) {
      return NextResponse.json(
        { message: "User not found" },
        { status: 404 }
      );
    }

    const dbProduct = await products.findOne({ _id: productObjectId });

    if (!dbProduct || dbProduct.stock <= 0) {
      return NextResponse.json(
        { message: "Out of stock" },
        { status: 400 }
      );
    }

    // Try increment first
    const updateResult = await users.updateOne(
      {
        _id: userId,
        "cart.productId": productId,
      },
      {
        $inc: { "cart.$.quantity": 1 },
      }
    );

    if (updateResult.modifiedCount === 0) {
      await users.updateOne(
        { _id: userId },
        {
          $push: {
            cart: {
              productId: productId,
              name: dbProduct.name,
              price: dbProduct.price,
              quantity: 1,
            },
          },
        }
      );
    }

    return NextResponse.json({ message: "Cart updated" });

  } catch (error) {
    console.error("ADD CART ERROR:", error);
    return NextResponse.json(
      { message: "Error adding to cart" },
      { status: 500 }
    );
  }
}
