"use client";

import { IndexTable, Text, Button } from "@shopify/polaris";

export type Order = {
  id: string;
  orderNumber: number;
  customerName: string;
  email: string;
  totalPrice: string;
  fulfillmentStatus: string;
};

type OrdersTableProps = {
  orders: Order[];
  onBookShipment: (orderId: string) => void;
};

export const OrdersTable = ({ orders, onBookShipment }: OrdersTableProps) => {
  const rowMarkup = orders.map(
    (
      { id, orderNumber, customerName, email, totalPrice, fulfillmentStatus },
      index
    ) => (
      <IndexTable.Row id={id} key={id} position={index}>
        <IndexTable.Cell>
          <Text as="span">#{orderNumber}</Text>
        </IndexTable.Cell>

        <IndexTable.Cell>{customerName}</IndexTable.Cell>

        <IndexTable.Cell>{email}</IndexTable.Cell>

        <IndexTable.Cell>${totalPrice}</IndexTable.Cell>

        <IndexTable.Cell>{fulfillmentStatus}</IndexTable.Cell>

        <IndexTable.Cell>
          <Button variant="primary" onClick={() => onBookShipment(id)}>
            Book Shipment
          </Button>
        </IndexTable.Cell>
      </IndexTable.Row>
    )
  );

  return (
    <IndexTable
      resourceName={{ singular: "order", plural: "orders" }}
      itemCount={orders.length}
      headings={[
        { title: "Order #" },
        { title: "Customer" },
        { title: "Email" },
        { title: "Total" },
        { title: "Fulfillment" },
        { title: "Action" },
      ]}
      selectable={false}
    >
      {rowMarkup}
    </IndexTable>
  );
};
