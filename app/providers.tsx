import createApp from "@shopify/app-bridge";

export function initAppBridge(host: string) {
  return createApp({
    apiKey: process.env.NEXT_PUBLIC_SHOPIFY_API_KEY!,
    host,
    forceRedirect: true,
  });
}
