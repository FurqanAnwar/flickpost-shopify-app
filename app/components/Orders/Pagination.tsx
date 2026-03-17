// components/orders/OrdersPagination.tsx
const PAGE_BTN_BASE: React.CSSProperties = {
  width: 32,
  height: 32,
  borderRadius: 6,
  border: "0.5px solid var(--p-color-border)",
  background: "transparent",
  cursor: "pointer",
  fontSize: 13,
  fontWeight: 500,
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  transition: "background 0.12s",
};

export const OrdersPagination = ({
  page,
  totalPages,
  totalOrders,
  pageSize,
  onPageChange,
}: {
  page: number;
  totalPages: number;
  totalOrders: number;
  pageSize: number;
  onPageChange: (p: number) => void;
}) => {
  const start = (page - 1) * pageSize + 1;
  const end = Math.min(page * pageSize, totalOrders);

  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 20px", borderTop: "0.5px solid var(--p-color-border)" }}>
      <span style={{ fontSize: 12, color: "var(--p-color-text-secondary)" }}>
        Showing {start}–{end} of {totalOrders}
      </span>
      <div style={{ display: "flex", gap: 4 }}>
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
          <button
            key={p}
            onClick={() => onPageChange(p)}
            style={{
              ...PAGE_BTN_BASE,
              background: p === page ? "#1A1A1A" : "transparent",
              color: p === page ? "#fff" : "var(--p-color-text)",
              border: p === page ? "none" : "0.5px solid var(--p-color-border)",
            }}
          >
            {p}
          </button>
        ))}
      </div>
    </div>
  );
};