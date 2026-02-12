"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/app/context/CartContext";



export default function CartPage() {
  const [cart, setCart] = useState([]);
  const { setCartCount } = useCart();
  const [address, setAddress] = useState({
  fullName: "",
  phone: "",
  line1: "",
  city: "",
  state: "",
  pincode: "",
});



  const router = useRouter();

  async function fetchCart() {
  const res = await fetch("/api/cart");
  const data = await res.json();
  const cartItems = data.cart || [];

  setCart(cartItems);

  // 🔥 Update badge count
  const totalQty = cartItems.reduce(
    (sum, item) => sum + item.quantity,
    0
  );

  setCartCount(totalQty);
}

  useEffect(() => {
    fetchCart();
  }, []);

  async function updateQuantity(productId, action) {
  await fetch("/api/cart/update", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ productId, action }),
  });

  await fetchCart();
  router.refresh(); // 👈 THIS updates navbar badge
}


  async function removeItem(productId) {
  await fetch("/api/cart/remove", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ productId }),
  });

  await fetchCart();
  router.refresh(); // 👈 THIS updates navbar badge
}
  
async function handleCheckout() {

  // 🔥 Basic validation before payment
  if (
    !address.fullName ||
    !address.phone ||
    !address.line1 ||
    !address.city ||
    !address.state ||
    !address.pincode
  ) {
    alert("Please fill complete delivery address");
    return;
  }

  const res = await fetch("/api/payment/create-order", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ address }), // 🔥 ADD THIS
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
        body: JSON.stringify({
          ...response,
          dbOrderId: data.dbOrderId,
        }),
      });

      alert("Payment Successful!");
      window.location.href = "/orders";
    },
    prefill: {
      name: "Customer",
      email: "customer@email.com",
    },
    theme: {
      color: "#3399cc",
    },
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




  const total = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <div style={{ padding: "40px" }}>
      <h1>Your Cart</h1>

      {cart.length === 0 && <p>Cart is empty</p>}

      {cart.map((item) => (
        <div key={item.productId} style={{ marginBottom: "15px" }}>
          <strong>{item.name}</strong>
          <p>₹{item.price}</p>

          <button onClick={() => updateQuantity(item.productId, "decrease")}>-</button>
          <span style={{ margin: "0 10px" }}>{item.quantity}</span>
          <button onClick={() => updateQuantity(item.productId, "increase")}>+</button>

          <button
            onClick={() => removeItem(item.productId)}
            style={{ marginLeft: "15px", color: "red" }}
          >
            Remove
          </button>
        </div>
      ))}

      <hr />
      <h3>Total: ₹{total}</h3>
        <div style={{ marginTop: "20px" }}>
  <h3>Delivery Address</h3>

  <input
    type="text"
    placeholder="Full Name"
    value={address.fullName}
    onChange={(e) => setAddress({ ...address, fullName: e.target.value })}
  />

  <input
    type="text"
    placeholder="Phone"
    value={address.phone}
    onChange={(e) => setAddress({ ...address, phone: e.target.value })}
  />

  <input
    type="text"
    placeholder="Address Line"
    value={address.line1}
    onChange={(e) => setAddress({ ...address, line1: e.target.value })}
  />

  <input
    type="text"
    placeholder="City"
    value={address.city}
    onChange={(e) => setAddress({ ...address, city: e.target.value })}
  />

  <input
    type="text"
    placeholder="State"
    value={address.state}
    onChange={(e) => setAddress({ ...address, state: e.target.value })}
  />

  <input
    type="text"
    placeholder="Pincode"
    value={address.pincode}
    onChange={(e) => setAddress({ ...address, pincode: e.target.value })}
  />
</div>

        <button
  onClick={handleCheckout}
  style={{
    marginTop: "20px",
    padding: "10px 20px",
    background: "black",
    color: "white",
    border: "none",
    cursor: "pointer",
  }}
>
  Checkout
</button>

    </div>
  );
}
