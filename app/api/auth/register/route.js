import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { hashPassword } from '@/lib/auth';

export async function POST(request) {
  try {
    const { name, email, password } = await request.json();

    if (!name || !email || !password || password.length < 6) {
      return NextResponse.json(
        { message: 'Name, email and password (min 6 chars) are required.' },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db();
    const users = db.collection('users');

    const existingUser = await users.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return NextResponse.json({ message: 'Email is already registered.' }, { status: 409 });
    }

    const hashedPassword = await hashPassword(password);
    await users.insertOne({
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
      createdAt: new Date()
    });

    return NextResponse.json({ message: 'User registered successfully.' }, { status: 201 });
  } catch (error) {
  console.error("REGISTER ERROR:", error);
  return NextResponse.json(
    { message: error.message },
    { status: 500 }
  );
}
}
