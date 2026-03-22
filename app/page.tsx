// app/page.tsx
import { Suspense } from "react";
import HomeClient from "./HomeClient"; // your client component for homepage
import { LoadingSpinner } from "./components/Spinner/Spinner";

export default function HomePage() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <HomeClient />
    </Suspense>
  );
}