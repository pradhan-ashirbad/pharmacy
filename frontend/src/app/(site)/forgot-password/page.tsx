import type { Metadata } from "next";

import { ForgotPasswordForm } from "./forgot-password-form";
import { AuthShell } from "@/components/auth/auth-shell";

export const metadata: Metadata = {
  title: "Forgot Password",
  description: "Reset your MediKart account password.",
};

export default function ForgotPasswordPage() {
  return (
    <AuthShell
      title="Forgot password?"
      subtitle="No worries — we'll send you a reset OTP."
    >
      <ForgotPasswordForm />
    </AuthShell>
  );
}
