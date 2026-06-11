"use client";

import * as React from "react";
import { Check, FileImage, FileText, X } from "lucide-react";
import { toast } from "sonner";

import { PrescriptionStatusBadge } from "@/components/orders/order-status-badge";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { adminPrescriptions, type AdminPrescriptionRow } from "@/data/admin";
import { formatDateTime } from "@/lib/utils";

type RxStatus = AdminPrescriptionRow["status"];

export function PrescriptionsManager() {
  // Local working copy — in production this talks to /api/admin/prescriptions.
  const [prescriptions, setPrescriptions] =
    React.useState<AdminPrescriptionRow[]>(adminPrescriptions);
  const [tab, setTab] = React.useState<"pending" | "all">("pending");

  const pending = prescriptions.filter(
    (rx) => rx.status === "uploaded" || rx.status === "under-review"
  );
  const visible = tab === "pending" ? pending : prescriptions;

  const setStatus = (id: string, status: RxStatus) => {
    setPrescriptions((list) =>
      list.map((rx) => (rx.id === id ? { ...rx, status } : rx))
    );
    if (status === "approved") {
      toast.success(`Prescription ${id} approved`, {
        description: "The customer can now order the prescribed medicines.",
      });
    } else if (status === "rejected") {
      toast(`Prescription ${id} rejected`, {
        description: "The customer will be asked to upload a clearer copy.",
      });
    }
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="font-display text-2xl font-bold tracking-tight">
            Prescriptions
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            {pending.length} awaiting pharmacist review
          </p>
        </div>
        <Tabs value={tab} onValueChange={(v) => setTab(v as "pending" | "all")}>
          <TabsList>
            <TabsTrigger value="pending">
              Pending{" "}
              {pending.length > 0 && (
                <Badge className="ml-1.5 h-5 min-w-5 justify-center rounded-full px-1.5 text-[10px]">
                  {pending.length}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="all">All</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        {visible.map((rx) => (
          <div key={rx.id} className="rounded-2xl border bg-card p-5 shadow-soft">
            <div className="flex items-start gap-4">
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-accent">
                {rx.fileType === "pdf" ? (
                  <FileText className="h-6 w-6 text-primary" />
                ) : (
                  <FileImage className="h-6 w-6 text-primary" />
                )}
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2">
                  <p className="font-mono text-xs font-bold text-muted-foreground">
                    {rx.id}
                  </p>
                  <PrescriptionStatusBadge status={rx.status} />
                </div>
                <p className="mt-1 truncate text-sm font-semibold">{rx.fileName}</p>
                <p className="text-xs text-muted-foreground">
                  {rx.customer} · {formatDateTime(rx.uploadedOn)}
                </p>
              </div>
            </div>

            <div className="mt-4">
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Requested medicines
              </p>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {rx.medicines.map((med) => (
                  <Badge key={med} variant="muted">
                    {med}
                  </Badge>
                ))}
              </div>
            </div>

            {(rx.status === "uploaded" || rx.status === "under-review") && (
              <div className="mt-5 flex gap-2">
                <Button
                  size="sm"
                  className="bg-success hover:bg-success/90"
                  onClick={() => setStatus(rx.id, "approved")}
                >
                  <Check className="h-4 w-4" />
                  Approve
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="border-destructive/40 text-destructive hover:bg-destructive/10 hover:text-destructive"
                  onClick={() => setStatus(rx.id, "rejected")}
                >
                  <X className="h-4 w-4" />
                  Reject
                </Button>
                {rx.status === "uploaded" && (
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => setStatus(rx.id, "under-review")}
                  >
                    Mark Reviewing
                  </Button>
                )}
              </div>
            )}
          </div>
        ))}
        {visible.length === 0 && (
          <div className="rounded-2xl border border-dashed p-12 text-center text-muted-foreground lg:col-span-2">
            All caught up — no prescriptions waiting for review. 🎉
          </div>
        )}
      </div>
    </div>
  );
}
