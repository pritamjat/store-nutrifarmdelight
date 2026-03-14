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
        <li>
          <a href="/admin/add-product" style={{
            display: "block",
            padding: "12px 16px",
            borderRadius: "8px",
            background: "#f7f7f5",
            color: "#111",
            textDecoration: "none",
            fontSize: "14px",
            fontWeight: "500",
            border: "0.5px solid #e5e5e5",
            transition: "background 0.15s",
          }}
            onMouseOver={e => e.currentTarget.style.background = "#efefec"}
            onMouseOut={e => e.currentTarget.style.background = "#f7f7f5"}
          >
            Add Product
          </a>
        </li>
        <li>
          <a href="/admin/products" style={{
            display: "block",
            padding: "12px 16px",
            borderRadius: "8px",
            background: "#f7f7f5",
            color: "#111",
            textDecoration: "none",
            fontSize: "14px",
            fontWeight: "500",
            border: "0.5px solid #e5e5e5",
            transition: "background 0.15s",
          }}
            onMouseOver={e => e.currentTarget.style.background = "#efefec"}
            onMouseOut={e => e.currentTarget.style.background = "#f7f7f5"}
          >
            Manage Products
          </a>
        </li>
        <li>
          <a href="/admin/orders" style={{
            display: "block",
            padding: "12px 16px",
            borderRadius: "8px",
            background: "#f7f7f5",
            color: "#111",
            textDecoration: "none",
            fontSize: "14px",
            fontWeight: "500",
            border: "0.5px solid #e5e5e5",
            transition: "background 0.15s",
          }}
            onMouseOver={e => e.currentTarget.style.background = "#efefec"}
            onMouseOut={e => e.currentTarget.style.background = "#f7f7f5"}
          >
            Orders
          </a>
        </li>
      </ul>
    </div>
  );
}
