import { getTokenFromDB } from "@/utils/getTokenFromDB";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const shop = searchParams.get("shop");

  if (!shop) return Response.json({ error: "Shop missing" }, { status: 400 });

  const accessToken = await getTokenFromDB(shop);

  const response = await fetch(
    `https://${shop}/admin/api/2024-01/orders.json?status=any&financial_status=paid&fields=id,order_number,total_price,fulfillment_status&limit=50`,
    {
      headers: {
        "X-Shopify-Access-Token": accessToken,
        "Content-Type": "application/json",
      },
    }
  );


  const data = await response.json();

  console.log("Shopify response:", JSON.stringify(data, null, 2)); // <-- check orders

  const orders = data?.orders?.map((order: any) => ({
    id: order.id,
    orderNumber: order.order_number,
    customerName: `${order.customer?.first_name || ""} ${order.customer?.last_name || ""}`.trim(),
    email: order.email,
    totalPrice: order.total_price,
    fulfillmentStatus: order.fulfillment_status ?? "unfulfilled",
  }));

  return Response.json({ orders });
}
