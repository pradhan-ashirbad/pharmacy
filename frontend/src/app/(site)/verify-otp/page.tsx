import type { Metadata } from "next";
import { Suspense } from "react";

import { OtpForm } from "./otp-form";
import { AuthShell } from "@/components/auth/auth-shell";
import { Skeleton } from "@/components/ui/skeleton";

export const metadata: Metadata = {
  title: "Verify OTP",
  description: "Verify your MediKart account with the OTP sent to you.",
};

export default function VerifyOtpPage() {
  return (
    <AuthShell
      title="Verify OTP"
      subtitle="Enter the 6-digit code we sent to your mobile/email. (Demo OTP: 123456)"
    >
      <Suspense fallback={<Skeleton className="h-40 w-full rounded-2xl" />}>
        <OtpForm />
      </Suspense>
    </AuthShell>
  );
}
