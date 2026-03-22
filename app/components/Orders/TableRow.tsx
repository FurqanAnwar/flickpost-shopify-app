// components/orders/OrdersTableRow.tsx
import { Order } from "@/app/types/order";
import { CustomerCell } from "./CustomerCell";
import { StatusBadge } from "./StatusBadge";

export const OrdersTableRow = ({
  order,
  onBookShipment,
}: {
  order: Order;
  onBookShipment: (id: string) => void;
}) => (
  <tr style={{ borderBottom: "0.5px solid var(--p-color-border)" }}>
    <td style={{ width: "20%", padding: "14px 16px", fontWeight: 600, fontSize: 13 }}>
      #{order.orderNumber}
    </td>
    <td style={{ width: "20%", padding: "14px 16px" }}>
      <CustomerCell name={order.customerName} email={order.email} />
    </td>
    <td style={{ width: "20%", padding: "14px 16px", fontWeight: 600, fontSize: 13.5 }}>
      ${parseFloat(order.totalPrice).toFixed(2)}
    </td>
    <td style={{ width: "25%", padding: "14px 16px" }}>
      <StatusBadge status={order.fulfillmentStatus} />
    </td>
    <td style={{ width: "25%", padding: "14px 16px",  textAlign: "center" }}>
      <button
        onClick={() => onBookShipment(order.id)}
        style={{ background: "#1A1A1A", color: "#fff", border: "none", padding: "7px 14px", borderRadius: 6, fontSize: 12, fontWeight: 500, cursor: "pointer", whiteSpace: "nowrap" }}
      >
        Book Shipment
      </button>
    </td>
  </tr>
);