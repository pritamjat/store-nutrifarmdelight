"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function ProfileDropdown({ name }) {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/");
     router.refresh();
  }

  return (
    <div style={{ position: "relative" }}>
      <button
        onClick={() => setOpen(!open)}
        style={{
          background: "none",
          border: "none",
          color: "white",
          cursor: "pointer",
          fontSize: "14px",
        }}
      >
        👤 {name} ▼
      </button>

      {open && (
        <div
          style={{
            position: "absolute",
            top: "30px",
            right: "0",
            background: "white",
            color: "black",
            padding: "10px",
            borderRadius: "6px",
            boxShadow: "0 5px 15px rgba(0,0,0,0.2)",
            minWidth: "150px",
            zIndex: 1000,
          }}
        >
          <div style={itemStyle} onClick={() => router.push("/orders")}>
            My Orders
             </div>
          <div style={itemStyle} onClick={() => router.push("/dashboard")}>
            Dashboard
          </div>
          <hr />
          <div
            style={{ ...itemStyle, color: "red" }}
            onClick={handleLogout}
          >
            Logout
          </div>
        </div>
      )}
    </div>
  );
}

const itemStyle = {
  padding: "8px",
  cursor: "pointer",
};

