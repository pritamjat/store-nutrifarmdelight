"use client";
import { useEffect, useState } from "react";
import AddressForm from "./AddressForm";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600&family=DM+Sans:wght@300;400;500&display=swap');

  :root {
    --white: #ffffff;
    --orange: #e8621a;
    --orange-light: #fdf0e8;
    --orange-hover: #d0541a;
    --green: #3a7d44;
    --green-light: #edf5ef;
    --text: #1c1c1a;
    --text-soft: #5a5a55;
    --border: #e8e4de;
    --bg: #f9f9f7;
  }

  .ap-root {
    font-family: 'DM Sans', sans-serif;
    max-width: 500px;
    margin: 50px auto;
    padding: 0 1rem;
  }

  .ap-root * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  .ap-title {
    font-family: 'Playfair Display', serif;
    font-size: 1.6rem;
    font-weight: 600;
    color: var(--text);
    margin-bottom: 1.75rem;
  }

  /* ADDRESS DISPLAY CARD */
  .ap-card {
    background: var(--white);
    border: 1px solid var(--border);
    padding: 1.5rem;
    margin-bottom: 1.25rem;
    box-shadow: 0 2px 8px rgba(26,26,24,0.04);
  }

  .ap-card-label {
    font-size: 0.68rem;
    font-weight: 500;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: var(--orange);
    margin-bottom: 0.85rem;
  }

  .ap-card-name {
    font-size: 1rem;
    font-weight: 500;
    color: var(--text);
    margin-bottom: 0.3rem;
  }

  .ap-card-line {
    font-size: 0.88rem;
    font-weight: 300;
    color: var(--text-soft);
    line-height: 1.7;
  }

  .ap-divider {
    height: 1px;
    background: var(--border);
    margin: 1rem 0;
  }

  .ap-btn-change {
    padding: 0.6rem 1.25rem;
    background: var(--white);
    color: var(--green);
    font-family: 'DM Sans', sans-serif;
    font-size: 0.78rem;
    font-weight: 500;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    border: 1px solid var(--green);
    cursor: pointer;
    transition: background 0.2s, color 0.2s;
  }

  .ap-btn-change:hover {
    background: var(--green-light);
  }
`;

export default function AddressPage() {
  const [address, setAddress] = useState(null);
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    fetch("/api/profile/address")
      .then((res) => res.json())
      .then((data) => setAddress(data.address || null));
  }, []);

  async function saveAddress(form) {
    const res = await fetch("/api/profile/address", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    if (!res.ok) return false;
    setAddress(form);
    setEditing(false);
    return true;
  }

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: styles }} />
      <div className="ap-root">
        <h2 className="ap-title">My Address</h2>

        {!editing && address && (
          <div className="ap-card">
            <p className="ap-card-label">Delivery Address</p>
            <p className="ap-card-name">{address.fullName}</p>
            <p className="ap-card-line">{address.phone}</p>
            <p className="ap-card-line">{address.line1}</p>
            <p className="ap-card-line">{address.city}, {address.state}</p>
            <p className="ap-card-line">{address.pincode}</p>
            <div className="ap-divider" />
            <button className="ap-btn-change" onClick={() => setEditing(true)}>
              Change Address
            </button>
          </div>
        )}

        {(editing || !address) && (
          <AddressForm
            initialData={address}
            onSave={saveAddress}
            onCancel={() => setEditing(false)}
          />
        )}
      </div>
    </>
  );
}
