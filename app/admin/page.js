export default function AdminPage() {
  const cards = [
    {
      href: "/admin/add-product",
      label: "Add product",
      description: "Create a new listing",
      color: "#EBF4FF",
      iconColor: "#185FA5",
      icon: (
        <path d="M8 3v10M3 8h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      ),
    },
    {
      href: "/admin/products",
      label: "Manage products",
      description: "Edit or remove items",
      color: "#EAF3DE",
      iconColor: "#3B6D11",
      icon: (
        <>
          <rect x="2" y="3" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.5" />
          <rect x="9" y="3" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.5" />
          <rect x="2" y="10" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.5" />
          <rect x="9" y="10" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.5" />
        </>
      ),
    },
    {
      href: "/admin/orders",
      label: "Orders",
      description: "View & track orders",
      color: "#FAEEDA",
      iconColor: "#854F0B",
      icon: (
        <>
          <path d="M2 2h2l2 8h6l2-6H5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          <circle cx="7" cy="13" r="1" fill="currentColor" />
          <circle cx="11" cy="13" r="1" fill="currentColor" />
        </>
      ),
    },
  ];

  return (
    <div style={{ padding: "2rem" }}>
      <div style={{ marginBottom: "2rem" }}>
        <p style={{ fontSize: 11, fontWeight: 500, letterSpacing: "0.08em", textTransform: "uppercase", color: "#888", margin: "0 0 6px" }}>
          Control panel
        </p>
        <h1 style={{ fontSize: 26, fontWeight: 500, margin: 0 }}>Admin Dashboard</h1>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 12 }}>
        {cards.map(({ href, label, description, color, iconColor, icon }) => (
          
            key={href}
            href={href}
            style={{
              textDecoration: "none",
              display: "block",
              background: "#fff",
              border: "0.5px solid #e5e5e5",
              borderRadius: 12,
              padding: "1.25rem",
              transition: "border-color 0.15s, background 0.15s",
            }}
          >
            <div style={{ width: 36, height: 36, borderRadius: 8, background: color, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 14 }}>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ color: iconColor }}>
                {icon}
              </svg>
            </div>
            <p style={{ fontSize: 14, fontWeight: 500, color: "#111", margin: "0 0 4px" }}>{label}</p>
            <p style={{ fontSize: 12, color: "#666", margin: 0 }}>{description}</p>
          </a>
        ))}
      </div>
    </div>
  );
}
