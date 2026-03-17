import createApp from "@shopify/app-bridge";

export function createShopifyAppBridge(host: string) {
  return createApp({
    apiKey: process.env.NEXT_PUBLIC_SHOPIFY_API_KEY!,
    host,
    forceRedirect: true,
  });
}
