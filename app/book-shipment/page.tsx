"use client"

import React from "react";
import { Suspense } from "react";
import { LoadingSpinner } from "../components/Spinner/Spinner";
const BookShipmentClient = React.lazy(() => import("../book-shipment/BookShipmentClient"));

export const dynamic = "force-dynamic";

export default function BookShipmentPage() {
  return (
    <Suspense  fallback={<LoadingSpinner />}>
      <BookShipmentClient />
    </Suspense>
  );
}
