
"use client";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { createShopifyAppBridge } from "@/lib/appBridge";
import { Page, Card } from "@shopify/polaris";
import { LoadingSpinner } from "./components/Spinner/Spinner";
import { OrdersNotFound } from "./components/Orders/NotFound";
import { OrdersTable } from "./components/Orders/Table";
import { Order } from "./types/order";
import React from "react";
const AppHeader = React.lazy(() => import("./components/Navigation/AppHeader"));

export default function Dashboard() {
  const params = useSearchParams();
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
    const searchParams = new URLSearchParams(window.location.search);
    searchParams.set("orderId", orderId);
    window.location.href = `/book-shipment?${searchParams.toString()}`;
  };

  return (
    <>
      <AppHeader activeTab="orders" />
      <Page title="Orders">
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
    </>
  );
}