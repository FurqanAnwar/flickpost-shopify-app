"use client";
import "@shopify/polaris/build/esm/styles.css";
import { AppProvider } from "@shopify/polaris";
import en from "@shopify/polaris/locales/en.json"; // full English i18n

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <AppProvider i18n={en}>{children}</AppProvider>
      </body>
    </html>
  );
}
