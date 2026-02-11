import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export default async function EditProductPage({ params }) {
  const client = await clientPromise;
  const db = client.db();
  const products = db.collection("products");

  const product = await products.findOne({
    _id: new ObjectId(params.id),
  });

  return (
    <div style={{ padding: "40px" }}>
      <h1>Edit Product</h1>

      <form
        action={`/api/products/update?id=${product._id}`}
        method="POST"
      >
        <input
          name="name"
          defaultValue={product.name}
          placeholder="Product Name"
        />

        <input
          name="price"
          defaultValue={product.price}
          placeholder="Price"
          type="number"
        />

        <input
          name="stock"
          defaultValue={product.stock}
          placeholder="Stock"
          type="number"
        />

        <button type="submit">Update</button>
      </form>
    </div>
  );
}

