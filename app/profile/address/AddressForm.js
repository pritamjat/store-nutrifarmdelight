"use client";
import { useState } from "react";

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
    --text-muted: #9a9a95;
    --border: #e8e4de;
    --bg: #f9f9f7;
  }

  .af-card {
    font-family: 'DM Sans', sans-serif;
    background: var(--white);
    border: 1px solid var(--border);
    padding: 2rem;
    display: flex;
    flex-direction: column;
    gap: 0;
    box-shadow: 0 2px 8px rgba(26,26,24,0.04), 0 8px 28px rgba(26,26,24,0.07);
  }

  .af-card * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  .af-message-success {
    font-size: 0.82rem;
    font-weight: 500;
    color: var(--green);
    background: var(--green-light);
    border: 1px solid rgba(58,125,68,0.25);
    padding: 0.6rem 0.9rem;
    margin-bottom: 1.25rem;
  }

  .af-message-error {
    font-size: 0.82rem;
    font-weight: 500;
    color: var(--orange);
    background: var(--orange-light);
    border: 1px solid rgba(232,98,26,0.25);
    padding: 0.6rem 0.9rem;
    margin-bottom: 1.25rem;
  }

  .af-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1rem;
  }

  .af-field {
    display: flex;
    flex-direction: column;
    gap: 0.4rem;
  }

  .af-field-full {
    grid-column: 1 / -1;
  }

  .af-label {
    font-size: 0.7rem;
    font-weight: 500;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: var(--text-soft);
  }

  .af-input {
    appearance: none;
    border: 1px solid var(--border);
    background: var(--bg);
    padding: 0.65rem 0.9rem;
    font-family: 'DM Sans', sans-serif;
    font-size: 0.9rem;
    font-weight: 300;
    color: var(--text);
    outline: none;
    transition: border-color 0.2s, background 0.2s, box-shadow 0.2s;
    width: 100%;
  }

  .af-input::placeholder { color: #c4bdb3; }

  .af-input:focus {
    border-color: var(--orange);
    background: var(--white);
    box-shadow: 0 0 0 3px rgba(232,98,26,0.1);
  }

  .af-actions {
    margin-top: 1.5rem;
    display: flex;
    gap: 0.75rem;
  }

  .af-btn-save {
    flex: 1;
    padding: 0.75rem 1rem;
    background: var(--orange);
    color: var(--white);
    font-family: 'DM Sans', sans-serif;
    font-size: 0.78rem;
    font-weight: 500;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    border: 1px solid var(--orange);
    cursor: pointer;
    transition: background 0.2s, border-color 0.2s;
  }

  .af-btn-save:hover:not(:disabled) {
    background: var(--orange-hover);
    border-color: var(--orange-hover);
  }

  .af-btn-save:disabled {
    opacity: 0.65;
    cursor: not-allowed;
  }

  .af-btn-cancel {
    padding: 0.75rem 1.25rem;
    background: var(--white);
    color: var(--text-soft);
    font-family: 'DM Sans', sans-serif;
    font-size: 0.78rem;
    font-weight: 500;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    border: 1px solid var(--border);
    cursor: pointer;
    transition: border-color 0.2s, color 0.2s;
  }

  .af-btn-cancel:hover {
    border-color: var(--text-soft);
    color: var(--text);
  }
`;

export default function AddressForm({ initialData, onSave, onCancel }) {
  const [form, setForm] = useState(
    initialData || {
      fullName: "",
      phone: "",
      line1: "",
      city: "",
      state: "",
      pincode: "",
    }
  );
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);

  async function handleSubmit() {
    setSaving(true);
    setMessage("");
    const success = await onSave(form);
    if (success) {
      setMessage("Address saved successfully");
      setIsError(false);
    } else {
      setMessage("Failed to save address");
      setIsError(true);
    }
    setSaving(false);
  }

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: styles }} />
      <div className="af-card">

        {message && (
          <p className={isError ? "af-message-error" : "af-message-success"}>
            {message}
          </p>
        )}

        <div className="af-grid">

          <div className="af-field af-field-full">
            <label className="af-label">Full Name</label>
            <input
              className="af-input"
              placeholder="Jane Doe"
              value={form.fullName}
              onChange={(e) => setForm({ ...form, fullName: e.target.value })}
            />
          </div>

          <div className="af-field af-field-full">
            <label className="af-label">Phone</label>
            <input
              className="af-input"
              placeholder="10-digit mobile number"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
            />
          </div>

          <div className="af-field af-field-full">
            <label className="af-label">Address Line</label>
            <input
              className="af-input"
              placeholder="House / Flat no., Street, Area"
              value={form.line1}
              onChange={(e) => setForm({ ...form, line1: e.target.value })}
            />
          </div>

          <div className="af-field">
            <label className="af-label">City</label>
            <input
              className="af-input"
              placeholder="City"
              value={form.city}
              onChange={(e) => setForm({ ...form, city: e.target.value })}
            />
          </div>

          <div className="af-field">
            <label className="af-label">State</label>
            <input
              className="af-input"
              placeholder="State"
              value={form.state}
              onChange={(e) => setForm({ ...form, state: e.target.value })}
            />
          </div>

          <div className="af-field">
            <label className="af-label">Pincode</label>
            <input
              className="af-input"
              placeholder="6-digit pincode"
              value={form.pincode}
              onChange={(e) => setForm({ ...form, pincode: e.target.value })}
            />
          </div>

        </div>

        <div className="af-actions">
          <button
            className="af-btn-save"
            onClick={handleSubmit}
            disabled={saving}
          >
            {saving ? "Saving..." : "Save Address"}
          </button>
          {onCancel && (
            <button className="af-btn-cancel" onClick={onCancel}>
              Cancel
            </button>
          )}
        </div>

      </div>
    </>
  );
}
