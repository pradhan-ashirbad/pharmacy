"use client";

import * as React from "react";
import { CloudUpload, FileImage, FileText, Loader2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useAccountStore } from "@/store/account";
import type { Prescription } from "@/types";

const ACCEPTED_TYPES = ["image/jpeg", "image/png", "image/webp", "application/pdf"];
const MAX_SIZE_MB = 5;

export function PrescriptionUploader({ compact = false }: { compact?: boolean }) {
  const addPrescription = useAccountStore((s) => s.addPrescription);
  const addNotification = useAccountStore((s) => s.addNotification);
  const [dragging, setDragging] = React.useState(false);
  const [uploading, setUploading] = React.useState(false);
  const inputRef = React.useRef<HTMLInputElement>(null);

  const handleFiles = async (files: FileList | null) => {
    const file = files?.[0];
    if (!file) return;

    if (!ACCEPTED_TYPES.includes(file.type)) {
      toast.error("Unsupported file type", {
        description: "Upload a JPG, PNG, WEBP image or a PDF.",
      });
      return;
    }
    if (file.size > MAX_SIZE_MB * 1024 * 1024) {
      toast.error("File too large", {
        description: `Maximum allowed size is ${MAX_SIZE_MB} MB.`,
      });
      return;
    }

    setUploading(true);
    // Mock upload; swap for POST /api/prescriptions (multipart) when wiring the API.
    await new Promise((r) => setTimeout(r, 1400));

    const rx: Prescription = {
      id: `rx-${Date.now().toString(36)}`,
      fileName: file.name,
      fileType: file.type === "application/pdf" ? "pdf" : "image",
      uploadedOn: new Date().toISOString(),
      status: "under-review",
    };
    addPrescription(rx);
    addNotification({
      id: `ntf-${Date.now().toString(36)}`,
      title: "Prescription received",
      body: `${file.name} is being reviewed by our pharmacist. Expect an update within 2 hours.`,
      date: new Date().toISOString(),
      read: false,
      kind: "prescription",
    });
    setUploading(false);
    toast.success("Prescription uploaded", {
      description: "Our pharmacist will review it within 2 hours.",
    });
    if (inputRef.current) inputRef.current.value = "";
  };

  return (
    <div
      onDragOver={(e) => {
        e.preventDefault();
        setDragging(true);
      }}
      onDragLeave={() => setDragging(false)}
      onDrop={(e) => {
        e.preventDefault();
        setDragging(false);
        handleFiles(e.dataTransfer.files);
      }}
      className={cn(
        "flex flex-col items-center justify-center rounded-2xl border-2 border-dashed text-center transition-colors",
        compact ? "p-6" : "p-10 sm:p-14",
        dragging ? "border-primary bg-accent/60" : "border-border bg-card"
      )}
    >
      <input
        ref={inputRef}
        type="file"
        accept=".jpg,.jpeg,.png,.webp,.pdf"
        className="hidden"
        onChange={(e) => handleFiles(e.target.files)}
        aria-label="Upload prescription file"
      />
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-accent">
        {uploading ? (
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        ) : (
          <CloudUpload className="h-8 w-8 text-primary" strokeWidth={1.5} />
        )}
      </div>
      <h3 className={cn("mt-4 font-semibold", compact ? "text-base" : "text-lg")}>
        {uploading ? "Uploading…" : "Drag & drop your prescription"}
      </h3>
      <p className="mt-1 max-w-sm text-sm text-muted-foreground">
        or choose a file from your device. We accept clear photos and PDFs up to{" "}
        {MAX_SIZE_MB} MB.
      </p>
      <div className="mt-4 flex items-center gap-3 text-xs text-muted-foreground">
        <span className="inline-flex items-center gap-1">
          <FileImage className="h-3.5 w-3.5" /> JPG / PNG / WEBP
        </span>
        <span className="inline-flex items-center gap-1">
          <FileText className="h-3.5 w-3.5" /> PDF
        </span>
      </div>
      <Button
        className="mt-5"
        onClick={() => inputRef.current?.click()}
        disabled={uploading}
      >
        Browse Files
      </Button>
    </div>
  );
}
