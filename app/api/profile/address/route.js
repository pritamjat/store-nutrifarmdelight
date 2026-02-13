import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { verifyToken } from "@/lib/auth";
import { cookies } from "next/headers";
import { ObjectId } from "mongodb";

// GET address
export async function GET() {
  try {
    const cookieStore = cookies();
    const token = cookieStore.get("auth_token")?.value;

    if (!token) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    const userData = await verifyToken(token);

    const client = await clientPromise;
    const db = client.db();
    const users = db.collection("users");

    const user = await users.findOne(
      { _id: new ObjectId(userData.sub) },
      { projection: { address: 1 } }
    );

    return NextResponse.json({
      address: user?.address || null,
    });

  } catch (error) {
    console.error("GET ADDRESS ERROR:", error);
    return NextResponse.json(
      { message: "Error fetching address" },
      { status: 500 }
    );
  }
}

// SAVE address
export async function POST(request) {
  try {
    const cookieStore = cookies();
    const token = cookieStore.get("auth_token")?.value;

    if (!token) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    const userData = await verifyToken(token);
    const address = await request.json();

    const client = await clientPromise;
    const db = client.db();
    const users = db.collection("users");

    await users.updateOne(
      { _id: new ObjectId(userData.sub) },
      { $set: { address: address } }
    );

    return NextResponse.json({
      message: "Address saved",
    });

  } catch (error) {
    console.error("SAVE ADDRESS ERROR:", error);
    return NextResponse.json(
      { message: "Error saving address" },
      { status: 500 }
    );
  }
}

