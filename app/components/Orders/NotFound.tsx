import { Box, Text } from "@shopify/polaris";

export const OrdersNotFound = () => {
  return (
    <Box padding="400" width="full">
      <div style={{ textAlign: "center" }}>
        <Text as="p" breakWord>
          No orders found.
        </Text>
      </div>
    </Box>
  );
};
