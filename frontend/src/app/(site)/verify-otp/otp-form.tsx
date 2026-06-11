"use client";

import * as React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { demoUser, useAuthStore } from "@/store/auth";

const OTP_LENGTH = 6;
const DEMO_OTP = "123456";

export function OtpForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const flow = searchParams.get("flow"); // "reset" | null (register)
  const login = useAuthStore((s) => s.login);

  const [digits, setDigits] = React.useState<string[]>(Array(OTP_LENGTH).fill(""));
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [resendIn, setResendIn] = React.useState(30);
  const inputsRef = React.useRef<(HTMLInputElement | null)[]>([]);

  React.useEffect(() => {
    if (resendIn <= 0) return;
    const t = setInterval(() => setResendIn((s) => s - 1), 1000);
    return () => clearInterval(t);
  }, [resendIn]);

  const setDigit = (index: number, value: string) => {
    const v = value.replace(/\D/g, "");
    setError(null);
    if (v.length > 1) {
      // Handle paste of the full code.
      const chars = v.slice(0, OTP_LENGTH).split("");
      const next = Array(OTP_LENGTH).fill("");
      chars.forEach((c, i) => (next[i] = c));
      setDigits(next);
      inputsRef.current[Math.min(chars.length, OTP_LENGTH - 1)]?.focus();
      return;
    }
    const next = [...digits];
    next[index] = v;
    setDigits(next);
    if (v && index < OTP_LENGTH - 1) inputsRef.current[index + 1]?.focus();
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !digits[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  const code = digits.join("");

  const verify = async () => {
    setLoading(true);
    setError(null);
    // Mock verify; swap for POST /api/auth/verify-otp when wiring the API.
    await new Promise((r) => setTimeout(r, 800));
    if (code !== DEMO_OTP) {
      setLoading(false);
      setError("Incorrect OTP. Hint: the demo code is 123456.");
      return;
    }
    if (flow === "reset") {
      toast.success("OTP verified", {
        description: "You can now login with your new password.",
      });
      router.push("/login");
      return;
    }
    const pending = sessionStorage.getItem("medikart-pending-user");
    const user = pending ? JSON.parse(pending) : demoUser;
    sessionStorage.removeItem("medikart-pending-user");
    login(user);
    toast.success("Account verified 🎉", { description: "Welcome to MediKart!" });
    router.push("/account");
  };

  return (
    <div>
      <div className="flex justify-between gap-2">
        {digits.map((digit, i) => (
          <input
            key={i}
            ref={(el) => {
              inputsRef.current[i] = el;
            }}
            value={digit}
            onChange={(e) => setDigit(i, e.target.value)}
            onKeyDown={(e) => handleKeyDown(i, e)}
            inputMode="numeric"
            maxLength={OTP_LENGTH}
            aria-label={`OTP digit ${i + 1}`}
            className={cn(
              "h-13 h-[52px] w-full max-w-[52px] rounded-xl border bg-background text-center text-xl font-bold outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20",
              error && "border-destructive"
            )}
          />
        ))}
      </div>

      {error && (
        <p className="mt-3 rounded-lg bg-destructive/10 px-3 py-2 text-sm font-medium text-destructive">
          {error}
        </p>
      )}

      <Button
        size="lg"
        className="mt-6 w-full"
        disabled={code.length !== OTP_LENGTH || loading}
        onClick={verify}
      >
        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Verify & Continue"}
      </Button>

      <p className="mt-5 text-center text-sm text-muted-foreground">
        Didn&apos;t receive the code?{" "}
        {resendIn > 0 ? (
          <span>
            Resend in <span className="font-semibold tabular-nums">{resendIn}s</span>
          </span>
        ) : (
          <button
            type="button"
            onClick={() => {
              setResendIn(30);
              toast.success("OTP resent", { description: "Demo OTP is 123456." });
            }}
            className="font-semibold text-primary hover:underline"
          >
            Resend OTP
          </button>
        )}
      </p>
    </div>
  );
}
