import type { Metadata } from "next";
import { Suspense } from "react";
import { Activity } from "lucide-react";

import { StoreBrowser } from "@/components/store/store-browser";
import { StoreHero } from "@/components/store/store-hero";
import { ProductGridSkeleton } from "@/components/product/product-grid";

export const metadata: Metadata = {
  title: "Health Devices & Fitness Gadgets",
  description:
    "BP monitors, glucometers, thermometers, pulse oximeters, smartwatches, fitness bands, weighing scales and nebulizers — clinically accurate devices with warranty.",
};

export default function HealthDevicesPage() {
  return (
    <>
      <StoreHero
        icon={Activity}
        title="Health Gadgets & Devices"
        description="Clinically accurate monitoring devices and smart fitness gadgets for proactive health at home."
        highlights={[
          "BP Monitors",
          "Glucometers",
          "Pulse Oximeters",
          "Smart Watches",
          "Nebulizers",
          "Manufacturer warranty",
        ]}
      />
      <div className="container py-8">
        <Suspense fallback={<ProductGridSkeleton />}>
          <StoreBrowser store="devices" />
        </Suspense>
      </div>
    </>
  );
}
