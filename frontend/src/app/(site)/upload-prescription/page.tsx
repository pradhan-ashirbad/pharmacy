import type { Metadata } from "next";
import { CheckCircle2, FileSearch, PackageCheck, Upload } from "lucide-react";

import { UploadView } from "./upload-view";

export const metadata: Metadata = {
  title: "Upload Prescription",
  description:
    "Upload your prescription as an image or PDF and order Rx medicines online. Verified by licensed pharmacists within 2 hours.",
};

const steps = [
  {
    icon: Upload,
    title: "Upload",
    description: "Share a clear photo or PDF of a valid prescription.",
  },
  {
    icon: FileSearch,
    title: "Pharmacist Review",
    description: "A licensed pharmacist verifies it, usually within 2 hours.",
  },
  {
    icon: CheckCircle2,
    title: "Approval",
    description: "You're notified the moment it's approved or needs changes.",
  },
  {
    icon: PackageCheck,
    title: "Order & Deliver",
    description: "Order Rx medicines against it — delivered to your door.",
  },
];

export default function UploadPrescriptionPage() {
  return (
    <div className="container py-10">
      <div className="mx-auto max-w-2xl text-center">
        <h1 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">
          Upload Your <span className="text-gradient">Prescription</span>
        </h1>
        <p className="mt-3 text-muted-foreground">
          Ordering prescription medicines on MediKart is simple, safe and fully
          compliant — every upload is reviewed by a licensed pharmacist.
        </p>
      </div>

      <div className="mx-auto mt-10 grid max-w-4xl gap-4 sm:grid-cols-4">
        {steps.map((step, i) => (
          <div
            key={step.title}
            className="relative rounded-2xl border bg-card p-5 text-center shadow-soft"
          >
            <span className="absolute left-3 top-3 text-xs font-bold text-muted-foreground">
              {i + 1}
            </span>
            <step.icon className="mx-auto h-7 w-7 text-primary" strokeWidth={1.6} />
            <h3 className="mt-3 text-sm font-semibold">{step.title}</h3>
            <p className="mt-1 text-xs text-muted-foreground">{step.description}</p>
          </div>
        ))}
      </div>

      <div className="mx-auto mt-10 max-w-3xl">
        <UploadView />
      </div>

      <div className="mx-auto mt-10 max-w-3xl rounded-2xl border bg-muted/40 p-5">
        <h2 className="text-sm font-semibold">A valid prescription includes</h2>
        <ul className="mt-3 grid gap-2 text-sm text-muted-foreground sm:grid-cols-2">
          <li>• Doctor's name & registration number</li>
          <li>• Patient name and age</li>
          <li>• Date of issue (within last 6 months)</li>
          <li>• Medicines with dosage clearly written</li>
        </ul>
      </div>
    </div>
  );
}
