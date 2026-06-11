"use client";

import { PrescriptionList } from "@/components/prescriptions/prescription-list";
import { PrescriptionUploader } from "@/components/prescriptions/prescription-uploader";
import { Skeleton } from "@/components/ui/skeleton";
import { useMounted } from "@/hooks/use-mounted";

export function PrescriptionsView() {
  const mounted = useMounted();

  if (!mounted) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-48 rounded-2xl" />
        <Skeleton className="h-24 rounded-2xl" />
        <Skeleton className="h-24 rounded-2xl" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PrescriptionUploader compact />
      <div>
        <h2 className="mb-4 text-base font-semibold">Uploaded Prescriptions</h2>
        <PrescriptionList />
      </div>
    </div>
  );
}
