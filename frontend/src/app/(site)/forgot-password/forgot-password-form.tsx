"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Loader2, MailCheck } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function ForgotPasswordForm() {
  const router = useRouter();
  const [email, setEmail] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [sent, setSent] = React.useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      toast.error("Please enter a valid email address");
      return;
    }
    setLoading(true);
    // Mock: swap for POST /api/auth/forgot-password when wiring the API.
    await new Promise((r) => setTimeout(r, 900));
    setLoading(false);
    setSent(true);
    toast.success("OTP sent", {
      description: "Use 123456 in this demo to verify.",
    });
  };

  if (sent) {
    return (
      <div className="text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-success/10">
          <MailCheck className="h-8 w-8 text-success" />
        </div>
        <h3 className="mt-4 font-semibold">Check your inbox</h3>
        <p className="mt-1.5 text-sm text-muted-foreground">
          We&apos;ve sent a 6-digit OTP to <span className="font-medium">{email}</span>.
          Enter it on the next screen to reset your password.
        </p>
        <Button
          size="lg"
          className="mt-6 w-full"
          onClick={() => router.push("/verify-otp?flow=reset")}
        >
          Enter OTP
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-1.5">
        <Label htmlFor="email">Registered email</Label>
        <Input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          autoComplete="email"
          required
        />
      </div>
      <Button type="submit" size="lg" className="w-full" disabled={loading}>
        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Send Reset OTP"}
      </Button>
      <p className="text-center text-sm text-muted-foreground">
        Remembered it?{" "}
        <Link href="/login" className="font-semibold text-primary hover:underline">
          Back to login
        </Link>
      </p>
    </form>
  );
}
