import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { createToken, verifyPassword } from '@/lib/auth';

export async function POST(request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json({ message: 'Email and password are required.' }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db();
    const users = db.collection('users');

    const user = await users.findOne({ email: email.toLowerCase() });
    if (!user.isVerified) {
  return NextResponse.json(
    { message: "Please verify your email before logging in." },
    { status: 403 }
  );
}


    const isValidPassword = await verifyPassword(password, user.password);
    if (!isValidPassword) {
      return NextResponse.json({ message: 'Invalid credentials.' }, { status: 401 });
    }

    const token = await createToken({
   sub: user._id.toString(),
   name: user.name,
   email: user.email,
   role: user.role 
   });


    const response = NextResponse.json({ message: 'Login successful.' });
    response.cookies.set('auth_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24
    });

    return response;
  } catch (error) {
    return NextResponse.json({ message: 'Something went wrong during login.' }, { status: 500 });
  }
}
