"use client";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import {
  Page,
  Card,
  DataTable,
  Badge,
  Text,
  BlockStack,
  EmptyState,
  Button,
  Filters,
  ChoiceList,
} from "@shopify/polaris";
import { AppHeader } from "../components/Navigation/AppHeader";

type ShipmentStatus =
  | "pending"
  | "in_transit"
  | "delivered"
  | "cancelled"
  | "exception";

interface Consignment {
  id: string;
  trackingNumber: string;
  orderId: string;
  origin: string;
  destination: string;
  status: ShipmentStatus;
  carrier: string;
  createdAt: string;
  estimatedDelivery: string;
  weight: string;
  declaredValue: string;
}

const STATUS_BADGE: Record<
  ShipmentStatus,
  { tone: "info" | "success" | "critical" | "warning" | "new"; label: string }
> = {
  pending: { tone: "new", label: "Pending" },
  in_transit: { tone: "info", label: "In Transit" },
  delivered: { tone: "success", label: "Delivered" },
  cancelled: { tone: "critical", label: "Cancelled" },
  exception: { tone: "warning", label: "Exception" },
};

// Dummy data — replace with real API call
const DUMMY_CONSIGNMENTS: Consignment[] = [
  {
    id: "CSG-001",
    trackingNumber: "FP1234567890PK",
    orderId: "#1001",
    origin: "Pakistan",
    destination: "United Kingdom",
    status: "in_transit",
    carrier: "DHL Express",
    createdAt: "2025-03-18",
    estimatedDelivery: "2025-03-25",
    weight: "2.4 kg",
    declaredValue: "$320.00",
  },
  {
    id: "CSG-002",
    trackingNumber: "FP0987654321UK",
    orderId: "#1002",
    origin: "United Kingdom",
    destination: "United States",
    status: "delivered",
    carrier: "FedEx International",
    createdAt: "2025-03-10",
    estimatedDelivery: "2025-03-17",
    weight: "0.8 kg",
    declaredValue: "$95.00",
  },
  {
    id: "CSG-003",
    trackingNumber: "FP1122334455AE",
    orderId: "#1003",
    origin: "UAE",
    destination: "Pakistan",
    status: "pending",
    carrier: "Aramex",
    createdAt: "2025-03-20",
    estimatedDelivery: "2025-03-27",
    weight: "5.1 kg",
    declaredValue: "$210.00",
  },
  {
    id: "CSG-004",
    trackingNumber: "FP5566778899US",
    orderId: "#1004",
    origin: "United States",
    destination: "Canada",
    status: "exception",
    carrier: "UPS Worldwide",
    createdAt: "2025-03-14",
    estimatedDelivery: "2025-03-21",
    weight: "1.2 kg",
    declaredValue: "$450.00",
  },
  {
    id: "CSG-005",
    trackingNumber: "FP9988776655DE",
    orderId: "#1005",
    origin: "Germany",
    destination: "France",
    status: "cancelled",
    carrier: "DHL Parcel",
    createdAt: "2025-03-15",
    estimatedDelivery: "—",
    weight: "3.0 kg",
    declaredValue: "$180.00",
  },
];

export default function ConsignmentsPage() {
  const params = useSearchParams();
  const shop = params.get("shop") || "";

  const [consignments, setConsignments] = useState<Consignment[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string[]>([]);
  const [queryValue, setQueryValue] = useState("");

  useEffect(() => {
    fetchConsignments();
  }, [shop]);

  const fetchConsignments = async () => {
    try {
      // TODO: replace with real API call
      // const res = await fetch(`/api/consignments?shop=${shop}`);
      // const data = await res.json();
      // setConsignments(data.consignments || []);
      await new Promise((res) => setTimeout(res, 600)); // simulate load
      setConsignments(DUMMY_CONSIGNMENTS);
    } catch {
      setConsignments([]);
    } finally {
      setLoading(false);
    }
  };

  const filtered = consignments.filter((c) => {
    const matchesStatus =
      statusFilter.length === 0 || statusFilter.includes(c.status);
    const q = queryValue.toLowerCase();
    const matchesQuery =
      !q ||
      c.trackingNumber.toLowerCase().includes(q) ||
      c.orderId.toLowerCase().includes(q) ||
      c.origin.toLowerCase().includes(q) ||
      c.destination.toLowerCase().includes(q);
    return matchesStatus && matchesQuery;
  });

  const rows = filtered.map((c) => {
    const { tone, label } = STATUS_BADGE[c.status];
    return [
      <Text as="span" variant="bodyMd" fontWeight="semibold">
        {c.trackingNumber}
      </Text>,
      c.orderId,
      `${c.origin} → ${c.destination}`,
      c.carrier,
      <Badge tone={tone}>{label}</Badge>,
      c.createdAt,
      c.estimatedDelivery,
      c.weight,
      c.declaredValue,
    ];
  });

  return (
    <>
      <AppHeader activeTab="consignments" />
      <Page
        title="Consignments"
        primaryAction={{
          content: "Book New Shipment",
          url: `/book-shipment?shop=${shop}`,
        }}
      >
        <BlockStack gap="400">
          <Card padding="0">
            <Filters
              queryValue={queryValue}
              queryPlaceholder="Search by tracking number, order or country…"
              filters={[
                {
                  key: "status",
                  label: "Status",
                  filter: (
                    <ChoiceList
                      title="Status"
                      titleHidden
                      choices={[
                        { label: "Pending", value: "pending" },
                        { label: "In Transit", value: "in_transit" },
                        { label: "Delivered", value: "delivered" },
                        { label: "Exception", value: "exception" },
                        { label: "Cancelled", value: "cancelled" },
                      ]}
                      selected={statusFilter}
                      onChange={setStatusFilter}
                      allowMultiple
                    />
                  ),
                  shortcut: true,
                },
              ]}
              appliedFilters={
                statusFilter.length > 0
                  ? [
                      {
                        key: "status",
                        label: `Status: ${statusFilter.join(", ")}`,
                        onRemove: () => setStatusFilter([]),
                      },
                    ]
                  : []
              }
              onQueryChange={setQueryValue}
              onQueryClear={() => setQueryValue("")}
              onClearAll={() => {
                setStatusFilter([]);
                setQueryValue("");
              }}
            />

            {loading ? (
              <div style={{ padding: "4rem", textAlign: "center" }}>
                <Text as="p" tone="subdued">
                  Loading consignments…
                </Text>
              </div>
            ) : rows.length > 0 ? (
              <DataTable
                columnContentTypes={[
                  "text",
                  "text",
                  "text",
                  "text",
                  "text",
                  "text",
                  "text",
                  "text",
                  "numeric",
                ]}
                headings={[
                  "Tracking Number",
                  "Order",
                  "Route",
                  "Carrier",
                  "Status",
                  "Created",
                  "Est. Delivery",
                  "Weight",
                  "Declared Value",
                ]}
                rows={rows}
                hoverable
              />
            ) : (
              <EmptyState
                heading="No consignments found"
                image="https://cdn.shopify.com/s/files/1/0262/4071/2726/files/emptystate-files.png"
                action={{
                  content: "Book a shipment",
                  url: `/book-shipment?shop=${shop}`,
                }}
              >
                <p>
                  {queryValue || statusFilter.length > 0
                    ? "No consignments match your filters."
                    : "Your booked shipments will appear here once processed."}
                </p>
              </EmptyState>
            )}
          </Card>
        </BlockStack>
      </Page>
    </>
  );
}