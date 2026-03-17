import { Order } from "@/app/types/order";

export const OrdersTableHeader = ({ orders }: { orders: Order[] }) => (
  <div style={{ padding: "14px 20px", borderBottom: "0.5px solid var(--p-color-border)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
    <span style={{ fontWeight: 600, fontSize: 15 }}>Orders</span>
    <span style={{ fontSize: 12, color: "var(--p-color-text-secondary)", background: "var(--p-color-bg-surface-secondary)", padding: "3px 10px", borderRadius: 20, border: "0.5px solid var(--p-color-border)" }}>
      {orders.length} orders
    </span>
  </div>
);