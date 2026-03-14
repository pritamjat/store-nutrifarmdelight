export default function AdminPage() {
  return (
    <div style={{
      padding: "40px",
      maxWidth: "400px",
      margin: "40px auto",
      background: "#fff",
      borderRadius: "12px",
      border: "0.5px solid #e5e5e5",
      fontFamily: "Georgia, serif",
    }}>
      <h1 style={{
        fontSize: "22px",
        fontWeight: "500",
        color: "#111",
        marginBottom: "24px",
        paddingBottom: "16px",
        borderBottom: "0.5px solid #e5e5e5",
      }}>
        Admin Dashboard
      </h1>
      <ul style={{
        listStyle: "none",
        padding: 0,
        margin: 0,
        display: "flex",
        flexDirection: "column",
        gap: "8px",
      }}>
        {[
          { href: "/admin/add-product", label: "Add Product" },
          { href: "/admin/products", label: "Manage Products" },
          { href: "/admin/orders", label: "Orders" },
        ].map(({ href, label }) => (
          <li key={href}>
            <a href={href} style={{
              display: "block",
              padding: "12px 16px",
              borderRadius: "8px",
              background: "#f7f7f5",
              color: "#111",
              textDecoration: "none",
              fontSize: "14px",
              fontWeight: "500",
              border: "0.5px solid #e5e5e5",
            }}>
              {label}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
