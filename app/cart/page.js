"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/app/context/CartContext";

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

  .cart-root {
    font-family: 'DM Sans', sans-serif;
    max-width: 900px;
    margin: 0 auto;
    padding: 3rem 1.5rem 5rem;
    color: var(--text);
  }

  .cart-root * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  .cart-title {
    font-family: 'Playfair Display', serif;
    font-size: 2rem;
    font-weight: 600;
    color: var(--text);
    margin-bottom: 2rem;
  }

  /* EMPTY STATE */
  .cart-empty {
    background: var(--white);
    border: 1px solid var(--border);
    padding: 3rem;
    text-align: center;
    font-size: 0.95rem;
    font-weight: 300;
    color: var(--text-muted);
  }

  /* LAYOUT */
  .cart-layout {
    display: grid;
    grid-template-columns: 1fr 360px;
    gap: 1.5rem;
    align-items: start;
  }

  @media (max-width: 720px) {
    .cart-layout { grid-template-columns: 1fr; }
  }

  /* ITEMS */
  .cart-items {
    display: flex;
    flex-direction: column;
    gap: 0;
    border: 1px solid var(--border);
    background: var(--white);
  }

  .cart-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 1.1rem 1.25rem;
    border-bottom: 1px solid var(--border);
    gap: 1rem;
  }

  .cart-item:last-child { border-bottom: none; }

  .cart-item-info { flex: 1; }

  .cart-item-name {
    font-size: 0.95rem;
    font-weight: 500;
    color: var(--text);
    margin-bottom: 0.2rem;
  }

  .cart-item-price {
    font-size: 0.85rem;
    font-weight: 300;
    color: var(--text-soft);
  }

  .cart-item-right {
    display: flex;
    align-items: center;
    gap: 1rem;
    flex-shrink: 0;
  }

  /* QTY CONTROLS */
  .cart-qty {
    display: flex;
    align-items: center;
    border: 1px solid var(--border);
    background: var(--bg);
  }

  .cart-qty-btn {
    width: 32px;
    height: 32px;
    background: none;
    border: none;
    font-size: 1rem;
    color: var(--text-soft);
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: background 0.15s, color 0.15s;
  }

  .cart-qty-btn:hover {
    background: var(--orange-light);
    color: var(--orange);
  }

  .cart-qty-num {
    width: 32px;
    text-align: center;
    font-size: 0.88rem;
    font-weight: 500;
    color: var(--text);
  }

  /* REMOVE BTN */
  .cart-remove {
    font-size: 0.72rem;
    font-weight: 500;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: var(--text-muted);
    background: none;
    border: none;
    cursor: pointer;
    padding: 0.2rem 0;
    border-bottom: 1px solid transparent;
    transition: color 0.2s, border-color 0.2s;
  }

  .cart-remove:hover {
    color: var(--orange);
    border-color: var(--orange);
  }

  /* RIGHT PANEL */
  .cart-panel {
    display: flex;
    flex-direction: column;
    gap: 1.25rem;
  }

  /* TOTAL BOX */
  .cart-total-box {
    background: var(--white);
    border: 1px solid var(--border);
    padding: 1.25rem 1.5rem;
  }

  .cart-total-label {
    font-size: 0.68rem;
    font-weight: 500;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: var(--text-muted);
    margin-bottom: 0.5rem;
  }

  .cart-total-amount {
    font-family: 'Playfair Display', serif;
    font-size: 1.75rem;
    font-weight: 600;
    color: var(--green);
  }

  /* ADDRESS BOX */
  .cart-address-box {
    background: var(--white);
    border: 1px solid var(--border);
    padding: 1.25rem 1.5rem;
  }

  .cart-section-title {
    font-size: 0.68rem;
    font-weight: 500;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: var(--orange);
    margin-bottom: 1rem;
  }

  .cart-address-grid {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }

  .cart-address-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 0.75rem;
  }

  .cart-field {
    display: flex;
    flex-direction: column;
    gap: 0.3rem;
  }

  .cart-label {
    font-size: 0.68rem;
    font-weight: 500;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: var(--text-soft);
  }

  .cart-input {
    appearance: none;
    border: 1px solid var(--border);
    background: var(--bg);
    padding: 0.6rem 0.8rem;
    font-family: 'DM Sans', sans-serif;
    font-size: 0.88rem;
    font-weight: 300;
    color: var(--text);
    outline: none;
    width: 100%;
    transition: border-color 0.2s, background 0.2s, box-shadow 0.2s;
  }

  .cart-input::placeholder { color: #c4bdb3; }

  .cart-input:focus {
    border-color: var(--orange);
    background: var(--white);
    box-shadow: 0 0 0 3px rgba(232,98,26,0.1);
  }

  /* CHECKOUT BTN */
  .cart-checkout-btn {
    width: 100%;
    padding: 0.9rem 1rem;
    background: var(--orange);
    color: var(--white);
    font-family: 'DM Sans', sans-serif;
    font-size: 0.82rem;
    font-weight: 500;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    border: 1px solid var(--orange);
    cursor: pointer;
    position: relative;
    overflow: hidden;
    transition: background 0.2s, border-color 0.2s;
  }

  .cart-checkout-btn:hover {
    background: var(--orange-hover);
    border-color: var(--orange-hover);
  }
`;

export default function CartPage() {
  const [cart, setCart] = useState([]);
  const { setCartCount } = useCart();
  const router = useRouter();

  const [address, setAddress] = useState({
    fullName: "",
    phone: "",
    line1: "",
    city: "",
    state: "",
    pincode: "",
  });

  async function fetchCart() {
    const res = await fetch("/api/cart", { credentials: "include" });
    const data = await res.json();
    const cartItems = data.cart || [];
    setCart(cartItems);
    const totalQty = cartItems.reduce((sum, item) => sum + item.quantity, 0);
    setCartCount(totalQty);
  }

  useEffect(() => { fetchCart(); }, []);

  async function updateQuantity(productId, action) {
    await fetch("/api/cart/update", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ productId, action }),
    });
    await fetchCart();
    router.refresh();
  }

  async function removeItem(productId) {
    await fetch("/api/cart/remove", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ productId }),
    });
    await fetchCart();
    router.refresh();
  }

  async function handleCheckout() {
    if (
      !address.fullName || !address.phone || !address.line1 ||
      !address.city || !address.state || !address.pincode
    ) {
      alert("Please fill complete delivery address");
      return;
    }

    const res = await fetch("/api/payment/create-order", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ address }),
    });

    const data = await res.json();

    const options = {
      key: data.key,
      amount: data.razorpayOrder.amount,
      currency: "INR",
      name: "NutriFarm",
      description: "Order Payment",
      order_id: data.razorpayOrder.id,
      handler: async function (response) {
        await fetch("/api/payment/verify", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ ...response, dbOrderId: data.dbOrderId }),
        });
        alert("Payment Successful!");
        window.location.href = "/orders";
      },
      prefill: { name: "Customer", email: "customer@email.com" },
      theme: { color: "#3399cc" },
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  }

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);
  }, []);

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: styles }} />
      <div className="cart-root">
        <h1 className="cart-title">Your Cart</h1>

        {cart.length === 0 && (
          <div className="cart-empty">Cart is empty</div>
        )}

        {cart.length > 0 && (
          <div className="cart-layout">

            {/* LEFT — Items */}
            <div className="cart-items">
              {cart.map((item) => (
                <div key={item.productId} className="cart-item">
                  <div className="cart-item-info">
                    <p className="cart-item-name">{item.name}</p>
                    <p className="cart-item-price">₹{item.price}</p>
                  </div>
                  <div className="cart-item-right">
                    <div className="cart-qty">
                      <button
                        className="cart-qty-btn"
                        onClick={() => updateQuantity(item.productId, "decrease")}
                      >−</button>
                      <span className="cart-qty-num">{item.quantity}</span>
                      <button
                        className="cart-qty-btn"
                        onClick={() => updateQuantity(item.productId, "increase")}
                      >+</button>
                    </div>
                    <button
                      className="cart-remove"
                      onClick={() => removeItem(item.productId)}
                    >Remove</button>
                  </div>
                </div>
              ))}
            </div>

            {/* RIGHT — Summary + Address */}
            <div className="cart-panel">

              <div className="cart-total-box">
                <p className="cart-total-label">Order Total</p>
                <p className="cart-total-amount">₹{total}</p>
              </div>

              <div className="cart-address-box">
                <p className="cart-section-title">Delivery Address</p>
                <div className="cart-address-grid">

                  <div className="cart-field">
                    <label className="cart-label">Full Name</label>
                    <input
                      className="cart-input"
                      type="text"
                      placeholder="Jane Doe"
                      value={address.fullName}
                      onChange={(e) => setAddress({ ...address, fullName: e.target.value })}
                    />
                  </div>

                  <div className="cart-field">
                    <label className="cart-label">Phone</label>
                    <input
                      className="cart-input"
                      type="text"
                      placeholder="10-digit number"
                      value={address.phone}
                      onChange={(e) => setAddress({ ...address, phone: e.target.value })}
                    />
                  </div>

                  <div className="cart-field">
                    <label className="cart-label">Address Line</label>
                    <input
                      className="cart-input"
                      type="text"
                      placeholder="House / Street / Area"
                      value={address.line1}
                      onChange={(e) => setAddress({ ...address, line1: e.target.value })}
                    />
                  </div>

                  <div className="cart-address-row">
                    <div className="cart-field">
                      <label className="cart-label">City</label>
                      <input
                        className="cart-input"
                        type="text"
                        placeholder="City"
                        value={address.city}
                        onChange={(e) => setAddress({ ...address, city: e.target.value })}
                      />
                    </div>
                    <div className="cart-field">
                      <label className="cart-label">State</label>
                      <input
                        className="cart-input"
                        type="text"
                        placeholder="State"
                        value={address.state}
                        onChange={(e) => setAddress({ ...address, state: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="cart-field">
                    <label className="cart-label">Pincode</label>
                    <input
                      className="cart-input"
                      type="text"
                      placeholder="6-digit pincode"
                      value={address.pincode}
                      onChange={(e) => setAddress({ ...address, pincode: e.target.value })}
                    />
                  </div>

                </div>
              </div>

              <button className="cart-checkout-btn" onClick={handleCheckout}>
                Checkout
              </button>

            </div>
          </div>
        )}
      </div>
    </>
  );
}
