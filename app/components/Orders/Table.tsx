// components/orders/OrdersTable.tsx
import { useState } from "react";
import { Order } from "@/app/types/order";
import { OrdersTableHeader } from "./TableHeader";
import { OrdersTableRow } from "./TableRow";
import { OrdersPagination } from "./Pagination";

const TABLE_HEADERS = ["Order", "Customer", "Total", "Fulfillment", ""];
const PAGE_SIZE = 3; // minimum 3 per page

export const OrdersTable = ({
  orders,
  onBookShipment,
}: {
  orders: Order[];
  onBookShipment: (id: string) => void;
}) => {
  const [page, setPage] = useState(1);
  const totalPages = Math.ceil(orders.length / PAGE_SIZE);
  const start = (page - 1) * PAGE_SIZE;
  const slice = orders.slice(start, start + PAGE_SIZE);

  return (
    <div style={{ background: "var(--p-color-bg-surface)", border: "0.5px solid var(--p-color-border)", borderRadius: 12, overflow: "hidden" }}>
      <OrdersTableHeader orders={orders} />

      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 700 }}>
          <thead>
            <tr style={{ background: "var(--p-color-bg-surface-secondary)" }}>
              {TABLE_HEADERS.map((h, i) => (
                <th key={i} style={{ padding: "10px 16px", textAlign: "left", fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em", color: "var(--p-color-text-secondary)", whiteSpace: "nowrap" }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {slice.map((order) => (
              <OrdersTableRow key={order.id} order={order} onBookShipment={onBookShipment} />
            ))}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <OrdersPagination
          page={page}
          totalPages={totalPages}
          totalOrders={orders.length}
          pageSize={PAGE_SIZE}
          onPageChange={setPage}
        />
      )}
    </div>
  );
};
