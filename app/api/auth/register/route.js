import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { hashPassword } from "@/lib/auth";
import crypto from "crypto";
import { sendVerificationEmail } from "@/lib/email";

export async function POST(request) {
  try {
    const { name, email, password } = await request.json();

    if (!name || !email || !password || password.length < 6) {
      return NextResponse.json(
        { message: "Name, email and password (min 6 chars) are required." },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db();
    const users = db.collection("users");

    const existingUser = await users.findOne({
      email: email.toLowerCase(),
    });

    if (existingUser) {
      return NextResponse.json(
        { message: "Email is already registered." },
        { status: 409 }
      );
    }

    const hashedPassword = await hashPassword(password);

    // 🔥 Generate verification token
    const verificationToken = crypto
      .randomBytes(32)
      .toString("hex");

    const verificationTokenExpiry = new Date(
      Date.now() + 24 * 60 * 60 * 1000 // 24 hours
    );

    // 🔥 Insert user with verification fields
    await users.insertOne({
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
      role: "user",
      cart: [],
      isVerified: false,
      verificationToken,
      verificationTokenExpiry,
      createdAt: new Date(),
    });

    // 🔥 Send verification email
    await sendVerificationEmail(email, verificationToken);

    return NextResponse.json(
      {
        message:
          "Registration successful. Please check your email to verify your account.",
      },
      { status: 201 }
    );

  } catch (error) {
    console.error("REGISTER ERROR:", error);
    return NextResponse.json(
      { message: "Registration failed." },
      { status: 500 }
    );
  }
}
