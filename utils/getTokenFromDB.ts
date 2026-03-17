import { prisma } from "@/lib/prisma";

export async function getTokenFromDB(shopDomain: string) {
  const shopRecord = await prisma.shop.findUnique({
    where: {
      shopDomain,
    },
  });

  if (!shopRecord) {
    throw new Error(`Shop not found: ${shopDomain}`);
  }

  return shopRecord.accessToken;
}
