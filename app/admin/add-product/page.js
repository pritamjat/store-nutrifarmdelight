"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AddProductPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    name: "",
    price: "",
    description: "",
    image: "",
    stock: "",
  });

  async function handleSubmit(e) {
    e.preventDefault();

    const res = await fetch("/api/products/add", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(form),
    });

    if (res.ok) {
      alert("Product Added Successfully");
      router.push("/admin/products");
    } else {
      alert("Error adding product");
    }
  }

  return (
    <div style={{ padding: "40px" }}>
      <h1>Add New Product</h1>

      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "10px", maxWidth: "400px" }}>

        <input
          placeholder="Product Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          required
        />

        <input
          type="number"
          placeholder="Price"
          value={form.price}
          onChange={(e) => setForm({ ...form, price: e.target.value })}
          required
        />

        <textarea
          placeholder="Description"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
        />

        <input
          placeholder="Image URL"
          value={form.image}
          onChange={(e) => setForm({ ...form, image: e.target.value })}
        />

        <input
          type="number"
          placeholder="Stock"
          value={form.stock}
          onChange={(e) => setForm({ ...form, stock: e.target.value })}
        />

        <button type="submit">Add Product</button>

      </form>
    </div>
  );
}
