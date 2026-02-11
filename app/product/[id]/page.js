import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import { notFound } from "next/navigation";

export default async function ProductPage({ params }) {
  const client = await clientPromise;
  const db = client.db();
  const products = db.collection("products");

  const product = await products.findOne({
    _id: new ObjectId(params.id),
  });

  if (!product) {
    notFound();
  }

  return (
    <div style={{ padding: "40px" }}>
      <h1>{product.name}</h1>

      <img
        src={product.image}
        alt={product.name}
        width="300"
      />

      <p>{product.description}</p>

      <h3>₹{product.price}</h3>

      <p>Stock: {product.stock}</p>

      <AddToCartButton product={product} />
    </div>
  );
}

