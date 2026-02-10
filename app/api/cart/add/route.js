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

    const { product } = await request.json();

    const client = await clientPromise;
    const db = client.db();
    const users = db.collection("users");

    await users.updateOne(
      { _id: new ObjectId(userData.sub) },
      {
        $push: {
          cart: {
            ...product,
            quantity: 1
          }
        }
      }
    );

    return NextResponse.json({ message: "Added to cart" });

  } catch (error) {
    return NextResponse.json({ message: "Error adding to cart" }, { status: 500 });
  }
}

