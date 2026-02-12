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
      console.log("No token found");
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const userData = await verifyToken(token);
    console.log("Token sub:", userData.sub);

    if (!ObjectId.isValid(userData.sub)) {
      console.log("Invalid ObjectId format");
      return NextResponse.json(
        { message: "Invalid user ID" },
        { status: 400 }
      );
    }

    const { product } = await request.json();

    if (!product || !product.productId) {
      return NextResponse.json(
        { message: "Invalid product" },
        { status: 400 }
      );
    }

    const productId = product.productId.toString();

    const client = await clientPromise;
    const db = client.db();
    const users = db.collection("users");
    const products = db.collection("products");

    const userId = new ObjectId(userData.sub);

    const user = await users.findOne({ _id: userId });

    console.log("Mongo user found:", user ? user._id : null);

    if (!user) {
      return NextResponse.json(
        { message: "User not found" },
        { status: 404 }
      );
    }

    // Ensure cart exists
    if (!user.cart) {
      await users.updateOne(
        { _id: userId },
        { $set: { cart: [] } }
      );
    }

    // Check stock
    const dbProduct = await products.findOne({
      _id: new ObjectId(productId),
    });

    if (!dbProduct || dbProduct.stock <= 0) {
      return NextResponse.json(
        { message: "Out of stock" },
        { status: 400 }
      );
    }

    const existingItem = user.cart?.find(
      (item) => item.productId === productId
    );

    let result;

    if (existingItem) {
      result = await users.updateOne(
        {
          _id: userId,
          "cart.productId": productId,
        },
        {
          $inc: { "cart.$.quantity": 1 },
        }
      );
    } else {
      result = await users.updateOne(
        { _id: userId },
        {
          $push: {
            cart: {
              productId: productId,
              name: product.name,
              price: product.price,
              quantity: 1,
            },
          },
        }
      );
    }

    console.log("Matched:", result.matchedCount);
    console.log("Modified:", result.modifiedCount);

    return NextResponse.json({ message: "Cart updated" });

  } catch (error) {
    console.error("ADD CART ERROR:", error);
    return NextResponse.json(
      { message: "Error adding to cart" },
      { status: 500 }
    );
  }
}

