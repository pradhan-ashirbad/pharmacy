import type { Metadata } from "next";

import { LoginForm } from "./login-form";
import { AuthShell } from "@/components/auth/auth-shell";

export const metadata: Metadata = {
  title: "Login",
  description: "Login to your MediKart account to order medicines and track orders.",
};

export default function LoginPage() {
  return (
    <AuthShell
      title="Welcome back 👋"
      subtitle="Login to manage orders, prescriptions and more."
    >
      <LoginForm />
    </AuthShell>
  );
}
