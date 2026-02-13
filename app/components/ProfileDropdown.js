"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500&display=swap');

  :root {
    --white: #ffffff;
    --orange: #e8621a;
    --orange-light: #fdf0e8;
    --green: #3a7d44;
    --text: #1c1c1a;
    --text-soft: #5a5a55;
    --text-muted: #9a9a95;
    --border: #e8e4de;
    --bg: #f9f9f7;
  }

  .pd-trigger {
    display: flex;
    align-items: center;
    gap: 0.4rem;
    background: none;
    border: 1px solid var(--border);
    padding: 0.4rem 0.85rem;
    font-family: 'DM Sans', sans-serif;
    font-size: 0.82rem;
    font-weight: 500;
    color: var(--text-soft);
    cursor: pointer;
    transition: border-color 0.2s, color 0.2s;
  }

  .pd-trigger:hover {
    border-color: var(--green);
    color: var(--text);
  }

  .pd-trigger-avatar {
    width: 22px;
    height: 22px;
    border-radius: 50%;
    background: var(--green);
    color: var(--white);
    font-size: 0.65rem;
    font-weight: 500;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    text-transform: uppercase;
  }

  .pd-trigger-chevron {
    font-size: 0.6rem;
    color: var(--text-muted);
    margin-left: 0.1rem;
  }

  .pd-menu {
    position: absolute;
    top: calc(100% + 8px);
    right: 0;
    background: var(--white);
    border: 1px solid var(--border);
    box-shadow: 0 4px 16px rgba(26,26,24,0.1);
    min-width: 170px;
    z-index: 1000;
    overflow: hidden;
  }

  .pd-menu-item {
    display: block;
    width: 100%;
    padding: 0.65rem 1rem;
    font-family: 'DM Sans', sans-serif;
    font-size: 0.82rem;
    font-weight: 400;
    color: var(--text-soft);
    background: none;
    border: none;
    text-align: left;
    cursor: pointer;
    text-decoration: none;
    transition: background 0.15s, color 0.15s;
  }

  .pd-menu-item:hover {
    background: var(--bg);
    color: var(--text);
  }

  .pd-menu-divider {
    height: 1px;
    background: var(--border);
    margin: 0.25rem 0;
  }

  .pd-menu-item-logout {
    display: block;
    width: 100%;
    padding: 0.65rem 1rem;
    font-family: 'DM Sans', sans-serif;
    font-size: 0.82rem;
    font-weight: 400;
    color: var(--orange);
    background: none;
    border: none;
    text-align: left;
    cursor: pointer;
    transition: background 0.15s;
  }

  .pd-menu-item-logout:hover {
    background: var(--orange-light);
  }
`;

export default function ProfileDropdown({ name }) {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/");
    router.refresh();
  }

  const initials = name ? name.charAt(0) : "U";

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: styles }} />
      <div style={{ position: "relative" }}>
        <button className="pd-trigger" onClick={() => setOpen(!open)}>
          <span className="pd-trigger-avatar">{initials}</span>
          {name}
          <span className="pd-trigger-chevron">▼</span>
        </button>

        {open && (
          <div className="pd-menu">
            <button className="pd-menu-item" onClick={() => router.push("/orders")}>
              My Orders
            </button>
            <button className="pd-menu-item" onClick={() => router.push("/dashboard")}>
              Dashboard
            </button>
            <Link href="/profile/address" className="pd-menu-item">
              My Address
            </Link>
            <div className="pd-menu-divider" />
            <button className="pd-menu-item-logout" onClick={handleLogout}>
              Logout
            </button>
          </div>
        )}
      </div>
    </>
  );
}
