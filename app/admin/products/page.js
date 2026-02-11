import clientPromise from "@/lib/mongodb";

export default async function AdminProductsPage() {
  const client = await clientPromise;
  const db = client.db();
  const products = db.collection("products");

  const allProducts = await products.find().toArray();

  return (
    <div style={{ padding: "40px" }}>
      <h1>Manage Products</h1>

      {allProducts.map((product) => (
        <div
          key={product._id.toString()}
          style={{
            border: "1px solid #ddd",
            padding: "15px",
            marginBottom: "10px",
          }}
        >
          <h3>{product.name}</h3>
          <p>₹{product.price}</p>
          <p>Stock: {product.stock}</p>

          <a href={`/admin/products/edit/${product._id}`}>
            Edit
          </a>

          {" | "}

          <form
            action={`/api/products/delete?id=${product._id}`}
            method="POST"
            style={{ display: "inline" }}
          >
            <button type="submit" style={{ color: "red" }}>
              Delete
            </button>
          </form>
        </div>
      ))}
    </div>
  );
}

