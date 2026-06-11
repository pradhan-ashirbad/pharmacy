"use client";

import Link from "next/link";

import { PrescriptionList } from "@/components/prescriptions/prescription-list";
import { PrescriptionUploader } from "@/components/prescriptions/prescription-uploader";
import { Skeleton } from "@/components/ui/skeleton";
import { useMounted } from "@/hooks/use-mounted";

export function UploadView() {
  const mounted = useMounted();

  if (!mounted) {
    return <Skeleton className="h-72 rounded-2xl" />;
  }

  return (
    <div className="space-y-8">
      <PrescriptionUploader />
      <div>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-base font-semibold">Your Recent Uploads</h2>
          <Link
            href="/account/prescriptions"
            className="text-sm font-medium text-primary hover:underline"
          >
            Manage all
          </Link>
        </div>
        <PrescriptionList />
      </div>
    </div>
  );
}
