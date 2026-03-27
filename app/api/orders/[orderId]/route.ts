import { getTokenFromDB } from "@/utils/getTokenFromDB";

export async function GET(req: Request,  context: { params: { orderId: string } | Promise<{ orderId: string }> }) {
  const { searchParams } = new URL(req.url);
  const shop = searchParams.get("shop") || process.env.NEXT_PUBLIC_SHOP;
  const params = await context.params;
  const orderId = params.orderId;

  if (!shop || !orderId) {
    return Response.json({ error: "Shop or Order ID missing" }, { status: 400 });
  }

  const accessToken = await getTokenFromDB(shop);

  const response = await fetch(
    `https://${shop}/admin/api/2024-01/orders/${orderId}.json`,
    {
      headers: {
        "X-Shopify-Access-Token": accessToken,
        "Content-Type": "application/json",
        "ngrok-skip-browser-warning": "yes"
      },
    }
  );

  if (!response.ok) {
    return Response.json({ error: "Failed to fetch order" }, { status: 500 });
  }

  const data = await response.json();
  const order = data?.order;

  // Map to fields you need for shipment form
  const shipmentDefaults = {
    senderName: `${order?.customer?.first_name || ""} ${order?.customer?.last_name || ""}`.trim(),
    senderAddressLine1: order?.shipping_address?.address1 || "",
    senderAddressLine2: order?.shipping_address?.address2 || "",
    senderCity: order?.shipping_address?.city || "",
    senderState: order?.shipping_address?.province || "",
    senderPostalCode: order?.shipping_address?.zip || "",
    receiverName: order?.shipping_address?.name || "",
    receiverAddressLine1: order?.shipping_address?.address1 || "",
    receiverAddressLine2: order?.shipping_address?.address2 || "",
    receiverCity: order?.shipping_address?.city || "",
    receiverState: order?.shipping_address?.province || "",
    receiverPostalCode: order?.shipping_address?.zip || "",
    originCountry: order?.shipping_address?.country_code || "",
    destinationCountry: "",
    purposeOfShipment: "",
    declaredValue: order?.total_price || "",
    declaredWeight: "",
    currency: order?.currency || "USD",
  };

  return Response.json({ shipmentDefaults });
}
