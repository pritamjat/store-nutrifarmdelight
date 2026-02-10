import Link from "next/link";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth";

export default async function HomePage() {
  const cookieStore = cookies();
  const token = cookieStore.get("auth_token")?.value;

  let user = null;

  if (token) {
    try {
      user = await verifyToken(token);
    } catch (err) {
      user = null;
    }
  }

  const isLoggedIn = !!user;

  return (
    <div className="home">

      {/* NAVBAR */}
      <header className="navbar">
        <div className="logo">
          <Link href="/">NutriFarm</Link>
        </div>

        <div className="search">
          <input type="text" placeholder="Search for products..." />
        </div>

        <div className="nav-right">
          {!isLoggedIn ? (
            <>
              <Link href="/login"
