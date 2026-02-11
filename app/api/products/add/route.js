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

    const user = await verifyToken(token);

    if (user.role !== "admin") {
  return NextResponse.json({ message: "Forbidden" }, { status: 403 });
}

    const { name, price, description, image, stock } = await request.json();

    const client = await clientPromise;
    const db = client.db();
    const products = db.collection("products");

    await products.insertOne({
      name,
      price,
      description,
      image,
      stock,
      createdAt: new Date()
    });

    return NextResponse.json({ message: "Product added" });

  } catch (error) {
    return NextResponse.json({ message: "Error adding product" }, { status: 500 });
  }
}

