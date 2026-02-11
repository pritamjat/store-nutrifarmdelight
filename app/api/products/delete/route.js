import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import { verifyToken } from "@/lib/auth";
import { cookies } from "next/headers";

export async function POST(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    const cookieStore = cookies();
    const token = cookieStore.get("auth_token")?.value;

    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const user = await verifyToken(token);

    if (user.role !== "admin") {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    const client = await clientPromise;
    const db = client.db();
    const products = db.collection("products");

    await products.deleteOne({ _id: new ObjectId(id) });

    return NextResponse.redirect(new URL("/admin/products", request.url));

  } catch (error) {
    return NextResponse.json({ message: "Delete failed" }, { status: 500 });
  }
}

