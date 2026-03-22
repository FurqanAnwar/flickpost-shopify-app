"use client";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import {
  Page,
  Card,
  FormLayout,
  Select,
  TextField,
  Button,
  Banner,
  Divider,
  Text,
  BlockStack,
  InlineStack,
  Box,
} from "@shopify/polaris";
import { AppHeader } from "../components/Navigation/AppHeader";
import { COUNTRY_OPTIONS } from "../constants/countries";

interface ShipmentFormData {
  originCountry: string;
  destinationCountry: string;
  // Sender
  senderName: string;
  senderAddressLine1: string;
  senderAddressLine2: string;
  senderCity: string;
  senderState: string;
  senderPostalCode: string;
  // Receiver
  receiverName: string;
  receiverAddressLine1: string;
  receiverAddressLine2: string;
  receiverCity: string;
  receiverState: string;
  receiverPostalCode: string;
  // Shipment details
  purposeOfShipment: string;
  declaredValue: string;
  declaredWeight: string;
  currency: string;
}

const INITIAL_FORM: ShipmentFormData = {
  originCountry: "",
  destinationCountry: "",
  senderName: "",
  senderAddressLine1: "",
  senderAddressLine2: "",
  senderCity: "",
  senderState: "",
  senderPostalCode: "",
  receiverName: "",
  receiverAddressLine1: "",
  receiverAddressLine2: "",
  receiverCity: "",
  receiverState: "",
  receiverPostalCode: "",
  purposeOfShipment: "",
  declaredValue: "",
  declaredWeight: "",
  currency: "USD",
};

const PURPOSE_OPTIONS = [
  { label: "Select purpose", value: "" },
  { label: "Commercial Sale", value: "commercial_sale" },
  { label: "Gift", value: "gift" },
  { label: "Sample", value: "sample" },
  { label: "Return / Repair", value: "return_repair" },
  { label: "Personal Use", value: "personal_use" },
  { label: "Documents", value: "documents" },
  { label: "Other", value: "other" },
];

const CURRENCY_OPTIONS = [
  { label: "USD", value: "USD" },
  { label: "EUR", value: "EUR" },
  { label: "GBP", value: "GBP" },
  { label: "PKR", value: "PKR" },
  { label: "AED", value: "AED" },
];

export default function BookShipmentPage() {
  const params = useSearchParams();
  const shop = params.get("shop") || "";
  const orderId = params.get("orderId") || "";

  const [form, setForm] = useState<ShipmentFormData>(INITIAL_FORM);
  const [selectedOrderId, setSelectedOrderId] = useState(orderId);
  const [orders, setOrders] = useState<{ label: string; value: string }[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(!orderId);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<keyof ShipmentFormData, string>>>({});

  // If no orderId, fetch order list for dropdown
  useEffect(() => {
    if (!orderId && shop) {
      fetchOrdersForDropdown(shop);
    }
  }, [orderId, shop]);

  // If orderId present, pre-fill order-based fields
  useEffect(() => {
    if (orderId && shop) {
      prefillFromOrder(orderId, shop);
    }
  }, [orderId, shop]);

  const fetchOrdersForDropdown = async (shop: string) => {
    try {
      const res = await fetch(`/api/orders?shop=${shop}`);
      if (!res.ok) throw new Error();
      const data = await res.json();
      const opts = (data.orders || []).map((o: any) => ({
        label: `#${o.orderNumber || o.id} — ${o.customer?.name || "Unknown customer"}`,
        value: String(o.id),
      }));
      setOrders([{ label: "Select an order to pre-fill", value: "" }, ...opts]);
    } catch {
      setOrders([{ label: "No orders found", value: "" }]);
    } finally {
      setLoadingOrders(false);
    }
  };

  const prefillFromOrder = async (id: string, shop: string) => {
    try {
      const res = await fetch(`/api/orders/${id}?shop=${shop}`);
      if (!res.ok) return;
      const data = await res.json();
      const order = data.order;
      if (!order) return;

      const shipping = order.shippingAddress || {};
      setForm((prev) => ({
        ...prev,
        receiverName: shipping.name || "",
        receiverAddressLine1: shipping.address1 || "",
        receiverAddressLine2: shipping.address2 || "",
        receiverCity: shipping.city || "",
        receiverState: shipping.province || "",
        receiverPostalCode: shipping.zip || "",
        destinationCountry: shipping.countryCode || "",
        declaredValue: order.totalPrice || "",
        currency: order.currency || "USD",
      }));
    } catch {
      // silently fail — user can fill manually
    }
  };

  const handleOrderSelect = async (value: string) => {
    setSelectedOrderId(value);
    if (value && shop) {
      await prefillFromOrder(value, shop);
    }
  };

  const set = (field: keyof ShipmentFormData) => (value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const validate = (): boolean => {
    const required: (keyof ShipmentFormData)[] = [
      "originCountry",
      "destinationCountry",
      "senderName",
      "senderAddressLine1",
      "senderCity",
      "senderPostalCode",
      "receiverName",
      "receiverAddressLine1",
      "receiverCity",
      "receiverPostalCode",
      "purposeOfShipment",
      "declaredValue",
      "declaredWeight",
    ];
    const newErrors: Partial<Record<keyof ShipmentFormData, string>> = {};
    required.forEach((field) => {
      if (!form[field].trim()) {
        newErrors[field] = "This field is required";
      }
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    setSubmitting(true);
    try {
      // TODO: wire up to real backend
      await new Promise((res) => setTimeout(res, 1200)); // simulate API call
      const payload = {
        orderId: selectedOrderId || undefined,
        ...form,
      };
      // await fetch("/api/book-shipment", {
      //   method: "POST",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify(payload),
      // });
      setSubmitted(true);
    } catch (err) {
      console.error("Shipment booking failed", err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <AppHeader activeTab="book-shipment" />
      <Page
        title="Book Shipment"
        backAction={{ content: "Orders", url: `/?shop=${shop}` }}
      >
        <BlockStack gap="500">
          {submitted && (
            <Banner
              title="Shipment booked successfully"
              tone="success"
              onDismiss={() => setSubmitted(false)}
            >
              <p>Your shipment request has been submitted and is being processed.</p>
            </Banner>
          )}

          {/* Order selection — only shown when navigated without orderId */}
          {!orderId && (
            <Card>
              <BlockStack gap="300">
                <Text as="h2" variant="headingMd">
                  Select Order
                </Text>
                <Text as="p" variant="bodySm" tone="subdued">
                  Select an existing order to automatically pre-fill shipment details, or fill the form manually below.
                </Text>
                <Select
                  label="Order"
                  options={orders}
                  value={selectedOrderId}
                  onChange={handleOrderSelect}
                  disabled={loadingOrders}
                />
              </BlockStack>
            </Card>
          )}

          {/* Route */}
          <Card>
            <BlockStack gap="400">
              <Text as="h2" variant="headingMd">
                Shipment Route
              </Text>
              <FormLayout>
                <FormLayout.Group>
                  <Select
                    label="Origin Country"
                    options={COUNTRY_OPTIONS}
                    value={form.originCountry}
                    onChange={set("originCountry")}
                    error={errors.originCountry}
                  />
                  <Select
                    label="Destination Country"
                    options={COUNTRY_OPTIONS}
                    value={form.destinationCountry}
                    onChange={set("destinationCountry")}
                    error={errors.destinationCountry}
                  />
                </FormLayout.Group>
              </FormLayout>
            </BlockStack>
          </Card>

          {/* Sender Details */}
          <Card>
            <BlockStack gap="400">
              <Text as="h2" variant="headingMd">
                Sender Details
              </Text>
              <FormLayout>
                <TextField
                  label="Full Name / Company"
                  value={form.senderName}
                  onChange={set("senderName")}
                  autoComplete="name"
                  error={errors.senderName}
                />
                <TextField
                  label="Address Line 1"
                  value={form.senderAddressLine1}
                  onChange={set("senderAddressLine1")}
                  autoComplete="address-line1"
                  error={errors.senderAddressLine1}
                />
                <TextField
                  label="Address Line 2 (optional)"
                  value={form.senderAddressLine2}
                  onChange={set("senderAddressLine2")}
                  autoComplete="address-line2"
                />
                <FormLayout.Group>
                  <TextField
                    label="City"
                    value={form.senderCity}
                    onChange={set("senderCity")}
                    autoComplete="address-level2"
                    error={errors.senderCity}
                  />
                  <TextField
                    label="State / Province"
                    value={form.senderState}
                    onChange={set("senderState")}
                    autoComplete="address-level1"
                  />
                  <TextField
                    label="Postal Code"
                    value={form.senderPostalCode}
                    onChange={set("senderPostalCode")}
                    autoComplete="postal-code"
                    error={errors.senderPostalCode}
                  />
                </FormLayout.Group>
              </FormLayout>
            </BlockStack>
          </Card>

          {/* Receiver Details */}
          <Card>
            <BlockStack gap="400">
              <Text as="h2" variant="headingMd">
                Receiver Details
              </Text>
              <FormLayout>
                <TextField
                  label="Full Name / Company"
                  value={form.receiverName}
                  onChange={set("receiverName")}
                  autoComplete="name"
                  error={errors.receiverName}
                />
                <TextField
                  label="Address Line 1"
                  value={form.receiverAddressLine1}
                  onChange={set("receiverAddressLine1")}
                  autoComplete="address-line1"
                  error={errors.receiverAddressLine1}
                />
                <TextField
                  label="Address Line 2 (optional)"
                  value={form.receiverAddressLine2}
                  onChange={set("receiverAddressLine2")}
                  autoComplete="address-line2"
                />
                <FormLayout.Group>
                  <TextField
                    label="City"
                    value={form.receiverCity}
                    onChange={set("receiverCity")}
                    autoComplete="address-level2"
                    error={errors.receiverCity}
                  />
                  <TextField
                    label="State / Province"
                    value={form.receiverState}
                    onChange={set("receiverState")}
                    autoComplete="address-level1"
                  />
                  <TextField
                    label="Postal Code"
                    value={form.receiverPostalCode}
                    onChange={set("receiverPostalCode")}
                    autoComplete="postal-code"
                    error={errors.receiverPostalCode}
                  />
                </FormLayout.Group>
              </FormLayout>
            </BlockStack>
          </Card>

          {/* Shipment Details */}
          <Card>
            <BlockStack gap="400">
              <Text as="h2" variant="headingMd">
                Shipment Details
              </Text>
              <FormLayout>
                <Select
                  label="Purpose of Shipment"
                  options={PURPOSE_OPTIONS}
                  value={form.purposeOfShipment}
                  onChange={set("purposeOfShipment")}
                  error={errors.purposeOfShipment}
                />
                <FormLayout.Group>
                  <TextField
                    label="Declared Value"
                    type="number"
                    value={form.declaredValue}
                    onChange={set("declaredValue")}
                    autoComplete="off"
                    error={errors.declaredValue}
                    connectedRight={
                      <Select
                        label="Currency"
                        labelHidden
                        options={CURRENCY_OPTIONS}
                        value={form.currency}
                        onChange={set("currency")}
                      />
                    }
                  />
                  <TextField
                    label="Declared Weight (kg)"
                    type="number"
                    value={form.declaredWeight}
                    onChange={set("declaredWeight")}
                    autoComplete="off"
                    error={errors.declaredWeight}
                    suffix="kg"
                  />
                </FormLayout.Group>
              </FormLayout>
            </BlockStack>
          </Card>

          {/* Actions */}
          <Box paddingBlockEnd="600">
            <InlineStack gap="300" align="end">
              <Button url={`/?shop=${shop}`} variant="plain">
                Cancel
              </Button>
              <Button
                variant="primary"
                onClick={handleSubmit}
                loading={submitting}
              >
                Book Shipment
              </Button>
            </InlineStack>
          </Box>
        </BlockStack>
      </Page>
    </>
  );
}