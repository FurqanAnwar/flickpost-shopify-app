"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { createShopifyAppBridge } from "@/lib/appBridge";

export default function Dashboard() {
  const params = useSearchParams();
  const host = params.get("host");

  useEffect(() => {
    if (!host) return;

    createShopifyAppBridge(host);
  }, [host]);

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-2xl font-bold mb-6">
        Flickpost Shipping Dashboard
      </h1>

      <div className="bg-white rounded-xl shadow p-6">
        <p>Orders will appear here.</p>
      </div>
    </div>
  );
}
