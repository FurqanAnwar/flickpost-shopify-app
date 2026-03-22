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
  BlockStack,
  InlineStack,
  Box,
  Text,
} from "@shopify/polaris";
const AppHeader = React.lazy(() => import("../components/Navigation/AppHeader"));
import { COUNTRY_OPTIONS } from "../constants/countries";
import React from "react";

interface ShipmentFormData {
  originCountry: string;
  destinationCountry: string;
  senderName: string;
  senderAddressLine1: string;
  senderAddressLine2: string;
  senderCity: string;
  senderState: string;
  senderPostalCode: string;
  receiverName: string;
  receiverAddressLine1: string;
  receiverAddressLine2: string;
  receiverCity: string;
  receiverState: string;
  receiverPostalCode: string;
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

export default function BookShipmentClient() {
  const params = useSearchParams();
  const shop = params.get("shop") ?? "";
  const orderId = params.get("orderId") ?? "";

  const [form, setForm] = useState<ShipmentFormData>(INITIAL_FORM);
  const [selectedOrderId, setSelectedOrderId] = useState(orderId);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<keyof ShipmentFormData, string>>>({});

  const setField = (field: keyof ShipmentFormData) => (value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const validate = () => {
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
      if (!form[field].trim()) newErrors[field] = "This field is required";
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    setSubmitting(true);
    try {
      await new Promise((res) => setTimeout(res, 1200)); // simulate API
      const payload = {
        orderId: selectedOrderId || undefined,
        ...form,
      };
      console.log("Payload:", payload);
      setSubmitted(true);
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <AppHeader activeTab="book-shipment" />
      <Page title="Book Shipment" backAction={{ content: "Orders", url: `/?shop=${shop}` }}>
        <BlockStack gap="500">
          {submitted && (
            <Banner title="Shipment booked successfully" tone="success" onDismiss={() => setSubmitted(false)}>
              <p>Your shipment request has been submitted and is being processed.</p>
            </Banner>
          )}

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
                    onChange={setField("originCountry")}
                    error={errors.originCountry}
                  />
                  <Select
                    label="Destination Country"
                    options={COUNTRY_OPTIONS}
                    value={form.destinationCountry}
                    onChange={setField("destinationCountry")}
                    error={errors.destinationCountry}
                  />
                </FormLayout.Group>
              </FormLayout>
            </BlockStack>
          </Card>

          {/* Sender Details */}
          <Card>
            <BlockStack gap="400">
              <Text as="h2" variant="headingMd">Sender Details</Text>
              <FormLayout>
                <TextField label="Full Name / Company" value={form.senderName} onChange={setField("senderName")} error={errors.senderName} autoComplete="name" />
                <TextField label="Address Line 1" value={form.senderAddressLine1} onChange={setField("senderAddressLine1")} error={errors.senderAddressLine1} autoComplete="address-line1" />
                <TextField label="Address Line 2 (optional)" value={form.senderAddressLine2} onChange={setField("senderAddressLine2")} autoComplete="address-line2" />
                <FormLayout.Group>
                  <TextField label="City" value={form.senderCity} onChange={setField("senderCity")} error={errors.senderCity} autoComplete="address-level2" />
                  <TextField label="State / Province" value={form.senderState} onChange={setField("senderState")} autoComplete="address-level1" />
                  <TextField label="Postal Code" value={form.senderPostalCode} onChange={setField("senderPostalCode")} error={errors.senderPostalCode} autoComplete="postal-code" />
                </FormLayout.Group>
              </FormLayout>
            </BlockStack>
          </Card>

          {/* Receiver Details */}
          <Card>
            <BlockStack gap="400">
              <Text as="h2" variant="headingMd">Receiver Details</Text>
              <FormLayout>
                <TextField label="Full Name / Company" value={form.receiverName} onChange={setField("receiverName")} error={errors.receiverName} autoComplete="name" />
                <TextField label="Address Line 1" value={form.receiverAddressLine1} onChange={setField("receiverAddressLine1")} error={errors.receiverAddressLine1} autoComplete="address-line1" />
                <TextField label="Address Line 2 (optional)" value={form.receiverAddressLine2} onChange={setField("receiverAddressLine2")} autoComplete="address-line2" />
                <FormLayout.Group>
                  <TextField label="City" value={form.receiverCity} onChange={setField("receiverCity")} error={errors.receiverCity} autoComplete="address-level2" />
                  <TextField label="State / Province" value={form.receiverState} onChange={setField("receiverState")} autoComplete="address-level1" />
                  <TextField label="Postal Code" value={form.receiverPostalCode} onChange={setField("receiverPostalCode")} error={errors.receiverPostalCode} autoComplete="postal-code" />
                </FormLayout.Group>
              </FormLayout>
            </BlockStack>
          </Card>

          {/* Shipment Details */}
          <Card>
            <BlockStack gap="400">
              <Text as="h2" variant="headingMd">Shipment Details</Text>
              <FormLayout>
                <Select label="Purpose of Shipment" options={PURPOSE_OPTIONS} value={form.purposeOfShipment} onChange={setField("purposeOfShipment")} error={errors.purposeOfShipment} />
                <FormLayout.Group>
                  <TextField
                    label="Declared Value"
                    type="number"
                    value={form.declaredValue}
                    onChange={setField("declaredValue")}
                    error={errors.declaredValue}
                    autoComplete="off"
                    connectedRight={
                      <Select
                        labelHidden
                        label
                        options={CURRENCY_OPTIONS}
                        value={form.currency}
                        onChange={setField("currency")}
                      />
                    }
                  />
                  <TextField
                    label="Declared Weight (kg)"
                    type="number"
                    value={form.declaredWeight}
                    onChange={setField("declaredWeight")}
                    error={errors.declaredWeight}
                    autoComplete="off"
                    suffix="kg"
                  />
                </FormLayout.Group>
              </FormLayout>
            </BlockStack>
          </Card>

          <Box paddingBlockEnd="600">
            <InlineStack gap="300" align="end">
              <Button url={`/?shop=${shop}`} variant="plain">Cancel</Button>
              <Button variant="primary" onClick={handleSubmit} loading={submitting}>Book Shipment</Button>
            </InlineStack>
          </Box>
        </BlockStack>
      </Page>
    </>
  );
}
