"use client";

import { FileImage, FileText, FileX, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { PrescriptionStatusBadge } from "@/components/orders/order-status-badge";
import { EmptyState } from "@/components/shared/empty-state";
import { Button } from "@/components/ui/button";
import { formatDateTime } from "@/lib/utils";
import { useAccountStore } from "@/store/account";

export function PrescriptionList() {
  const prescriptions = useAccountStore((s) => s.prescriptions);
  const removePrescription = useAccountStore((s) => s.removePrescription);

  if (prescriptions.length === 0) {
    return (
      <EmptyState
        icon={FileX}
        title="No prescriptions uploaded"
        description="Upload a prescription to order Rx medicines. Our pharmacists verify every upload."
      />
    );
  }

  return (
    <ul className="space-y-3">
      {prescriptions.map((rx) => (
        <li
          key={rx.id}
          className="flex items-center gap-4 rounded-2xl border bg-card p-4 shadow-soft"
        >
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-accent">
            {rx.fileType === "pdf" ? (
              <FileText className="h-6 w-6 text-primary" />
            ) : (
              <FileImage className="h-6 w-6 text-primary" />
            )}
          </span>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold">{rx.fileName}</p>
            <p className="text-xs text-muted-foreground">
              Uploaded {formatDateTime(rx.uploadedOn)}
              {rx.doctorName ? ` · ${rx.doctorName}` : ""}
            </p>
            {rx.note && (
              <p className="mt-1 text-xs text-muted-foreground">{rx.note}</p>
            )}
          </div>
          <PrescriptionStatusBadge status={rx.status} />
          <Button
            variant="ghost"
            size="icon-sm"
            aria-label={`Delete ${rx.fileName}`}
            className="text-muted-foreground hover:text-destructive"
            onClick={() => {
              removePrescription(rx.id);
              toast("Prescription removed");
            }}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </li>
      ))}
    </ul>
  );
}
