import { Box, Spinner as PolarisSpinner } from "@shopify/polaris";

export const LoadingSpinner = () => {
  return (
    <Box padding="400" width="full">
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "200px", // vertical space for centering
        }}
      >
        <PolarisSpinner accessibilityLabel="Loading orders" size="large" />
      </div>
    </Box>
  );
};
