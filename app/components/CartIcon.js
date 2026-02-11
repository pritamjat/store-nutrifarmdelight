"use client";

import Link from "next/link";
import { useCart } from "@/app/context/CartContext";

export default function CartIcon() {
  const { cartCount } = useCart();

  return (
    <Link href="/cart" style={{ position: "relative" }}>
      🛒
      {cartCount > 0 && (
        <span
          style={{
            position: "absolute",
            top: "-8px",
            right: "-10px",
            background: "red",
            color: "white",
            borderRadius: "50%",
            padding: "3px 7px",
            fontSize: "12px",
          }}
        >
          {cartCount}
        </span>
      )}
    </Link>
  );
}

