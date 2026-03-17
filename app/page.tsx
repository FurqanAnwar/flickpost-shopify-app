"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { createShopifyAppBridge } from "@/lib/appBridge";

import { Page, Card } from "@shopify/polaris";
import { LoadingSpinner } from "./components/Spinner";
import { OrdersNotFound } from "./components/OrdersNotFound";
import { OrdersTable, Order } from "./components/OrdersTable";

export default function Dashboard() {
  const params = useSearchParams();

  // Default to empty string to avoid changing deps size
  const host = params.get("host") || "";
  const shop = params.get("shop") || "";

  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!host || !shop) return;

    createShopifyAppBridge(host);
    fetchOrders(shop);
  }, [host, shop]);

  const fetchOrders = async (shop: string) => {
    try {
      const res = await fetch(`/api/orders?shop=${shop}`);
      if (!res.ok) throw new Error("Failed to fetch orders");

      const data = await res.json();
      setOrders(data.orders || []);
    } catch (err) {
      console.error(err);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  const bookShipment = async (orderId: string) => {
    try {
      await fetch("/api/book-shipment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId }),
      });
      alert("Shipment booked!");
    } catch (err) {
      console.error("Shipment booking failed", err);
    }
  };

  return (
    <Page title="Flickpost Shipping Dashboard">
      <Card>
        {loading ? (
          <LoadingSpinner />
        ) : orders.length > 0 ? (
          <OrdersTable orders={orders} onBookShipment={bookShipment} />
        ) : (
          <OrdersNotFound />
        )}
      </Card>
    </Page>
  );
}
