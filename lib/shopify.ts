import { shopifyApi, ApiVersion } from "@shopify/shopify-api";

export const shopify = shopifyApi({
  apiKey: process.env.SHOPIFY_API_KEY!,
  apiSecretKey: process.env.SHOPIFY_API_SECRET!,
  scopes: process.env.SCOPES!.split(","),
  hostName: process.env.HOST!.replace(/https?:\/\//, ""),
  apiVersion: ApiVersion.January26,
  isEmbeddedApp: true
});
