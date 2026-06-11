import type { Metadata } from "next";

import { RegisterForm } from "./register-form";
import { AuthShell } from "@/components/auth/auth-shell";

export const metadata: Metadata = {
  title: "Create Account",
  description: "Register on MediKart for fast medicine delivery across India.",
};

export default function RegisterPage() {
  return (
    <AuthShell
      title="Create your account"
      subtitle="A healthier routine starts in under a minute."
    >
      <RegisterForm />
    </AuthShell>
  );
}
