import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db();
    const products = db.collection("products");

    const allProducts = await products.find().toArray();

    return NextResponse.json({ products: allProducts });

  } catch (error) {
    return NextResponse.json({ message: "Error fetching products" }, { status: 500 });
  }
}

