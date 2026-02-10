import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { verifyToken } from "@/lib/auth";
import { cookies } from "next/headers";
import { ObjectId } from "mongodb";

export async function GET() {
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

    const user = await users.findOne(
      { _id: new ObjectId(userData.sub) },
      { projection: { cart: 1 } }
    );

    return NextResponse.json({ cart: user.cart || [] });

  } catch (error) {
    return NextResponse.json({ message: "Error fetching cart" }, { status: 500 });
  }
}

