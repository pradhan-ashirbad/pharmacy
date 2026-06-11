"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

import { GoogleButton } from "@/components/auth/google-button";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { demoUser, useAuthStore } from "@/store/auth";

export function RegisterForm() {
  const router = useRouter();
  const login = useAuthStore((s) => s.login);
  const [form, setForm] = React.useState({
    name: "",
    email: "",
    phone: "",
    password: "",
  });
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (form.name.trim().length < 2) return setError("Please enter your full name.");
    if (!/^\S+@\S+\.\S+$/.test(form.email))
      return setError("Please enter a valid email address.");
    if (!/^\d{10}$/.test(form.phone.replace(/\s/g, "")))
      return setError("Please enter a valid 10-digit mobile number.");
    if (form.password.length < 6)
      return setError("Password must be at least 6 characters.");

    setLoading(true);
    // Mock register; swap for POST /api/auth/register when wiring the API.
    await new Promise((r) => setTimeout(r, 900));
    toast.success("Account created!", {
      description: "Verify the OTP sent to your mobile number.",
    });
    // Stash the pending user so the OTP page can complete the login.
    sessionStorage.setItem(
      "medikart-pending-user",
      JSON.stringify({
        ...demoUser,
        name: form.name.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
      })
    );
    router.push("/verify-otp");
  };

  const handleGoogle = async () => {
    setLoading(true);
    await new Promise((r) => setTimeout(r, 700));
    login(demoUser);
    toast.success("Signed up with Google");
    router.push("/account");
  };

  return (
    <div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-1.5">
          <Label htmlFor="name">Full name</Label>
          <Input
            id="name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            placeholder="Your name"
            autoComplete="name"
            required
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            placeholder="you@example.com"
            autoComplete="email"
            required
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="phone">Mobile number</Label>
          <Input
            id="phone"
            inputMode="numeric"
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
            placeholder="10-digit mobile number"
            autoComplete="tel"
            required
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            placeholder="Minimum 6 characters"
            autoComplete="new-password"
            required
          />
        </div>

        {error && (
          <p className="rounded-lg bg-destructive/10 px-3 py-2 text-sm font-medium text-destructive">
            {error}
          </p>
        )}

        <Button type="submit" size="lg" className="w-full" disabled={loading}>
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Create Account"}
        </Button>
        <p className="text-center text-xs text-muted-foreground">
          By continuing you agree to our Terms of Service & Privacy Policy.
        </p>
      </form>

      <div className="my-5 flex items-center gap-3">
        <Separator className="flex-1" />
        <span className="text-xs text-muted-foreground">OR</span>
        <Separator className="flex-1" />
      </div>

      <GoogleButton onClick={handleGoogle} disabled={loading} />

      <p className="mt-6 text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link href="/login" className="font-semibold text-primary hover:underline">
          Login
        </Link>
      </p>
    </div>
  );
}
