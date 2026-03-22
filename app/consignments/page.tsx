'use client'
import React from "react";
import { Suspense } from "react";
import { LoadingSpinner } from "../components/Spinner/Spinner";
const ConsignmentsClient = React.lazy(() => import("./ConsignmentsClient"));

export const dynamic = "force-dynamic";

export default function Page() {
  return (
    <Suspense fallback={<LoadingSpinner/>}>
      <ConsignmentsClient />
    </Suspense>
  );
}
