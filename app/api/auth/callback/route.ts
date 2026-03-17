import { NextRequest, NextResponse } from "next/server";
import axios from "axios";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const shop = req.nextUrl.searchParams.get("shop");
  const code = req.nextUrl.searchParams.get("code");
  const host = req.nextUrl.searchParams.get("host");

  if (!shop || !code) {
    return NextResponse.json({ error: "Invalid OAuth callback" }, { status: 400 });
  }

  // Exchange code for access token
  const response = await axios.post(`https://${shop}/admin/oauth/access_token`, {
    client_id: process.env.SHOPIFY_API_KEY,
    client_secret: process.env.SHOPIFY_API_SECRET,
    code,
  });

  const accessToken = response.data.access_token;

  // Save in DB
  await prisma.shop.upsert({
    where: { shopDomain: shop },
    update: { accessToken },
    create: { shopDomain: shop, accessToken },
  });

return NextResponse.redirect(
  `${process.env.HOST}/?shop=${shop}&host=${host}`
);

}
