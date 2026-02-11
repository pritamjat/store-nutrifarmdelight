export default function AdminPage() {
  return (
    <div style={{ padding: "40px" }}>
      <h1>Admin Dashboard</h1>

      <ul>
        <li><a href="/admin/add-product">Add Product</a></li>
        <li><a href="/admin/products">Manage Products</a></li>
      </ul>
    </div>
  );
}


