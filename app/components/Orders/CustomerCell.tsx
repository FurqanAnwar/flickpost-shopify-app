function getInitials(name: string) {
  return name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
}

export const CustomerCell = ({ name, email }: { name: string; email: string }) => (
  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
    <div style={{ width: 30, height: 30, borderRadius: "50%", background: "#E6F1FB", color: "#185FA5", fontSize: 11, fontWeight: 600, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
      {getInitials(name || "NA")}
    </div>
    <div>
      <div style={{ fontWeight: 500, fontSize: 13 }}>{name || "N/A"}</div>
      <div style={{ fontSize: 11, color: "var(--p-color-text-secondary)" }}>{email || "N/A"}</div>
    </div>
  </div>
);