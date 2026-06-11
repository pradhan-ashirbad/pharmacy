"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import {
  Banknote,
  Building2,
  Check,
  ChevronLeft,
  CreditCard,
  Loader2,
  MapPin,
  Plus,
  ShieldCheck,
  ShoppingCart,
  Smartphone,
  Truck,
  Wallet,
  Zap,
} from "lucide-react";
import { toast } from "sonner";

import { PriceSummaryCard } from "@/components/cart/price-summary-card";
import { EmptyState } from "@/components/shared/empty-state";
import { ProductVisual } from "@/components/shared/product-visual";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Skeleton } from "@/components/ui/skeleton";
import { useMounted } from "@/hooks/use-mounted";
import { buildOrder, paymentMethodLabels } from "@/lib/orders";
import { computeSummary } from "@/lib/pricing";
import { cn, formatINR } from "@/lib/utils";
import { useAccountStore } from "@/store/account";
import { useCartStore } from "@/store/cart";
import type { Address, PaymentMethod } from "@/types";

const steps = [
  { id: 1, label: "Address" },
  { id: 2, label: "Delivery" },
  { id: 3, label: "Payment" },
  { id: 4, label: "Review" },
];

const paymentOptions: {
  value: PaymentMethod;
  label: string;
  description: string;
  icon: typeof Smartphone;
}[] = [
  { value: "upi", label: "UPI", description: "GPay, PhonePe, Paytm & more", icon: Smartphone },
  { value: "credit-card", label: "Credit Card", description: "Visa, Mastercard, RuPay, Amex", icon: CreditCard },
  { value: "debit-card", label: "Debit Card", description: "All major bank debit cards", icon: CreditCard },
  { value: "net-banking", label: "Net Banking", description: "60+ banks supported", icon: Building2 },
  { value: "wallet", label: "Wallet", description: "Paytm, Amazon Pay, Mobikwik", icon: Wallet },
  { value: "cod", label: "Cash on Delivery", description: "Pay when your order arrives", icon: Banknote },
];

const emptyAddressForm = {
  fullName: "",
  phone: "",
  line1: "",
  line2: "",
  city: "",
  state: "",
  pincode: "",
  label: "Home" as Address["label"],
};

export function CheckoutFlow() {
  const router = useRouter();
  const mounted = useMounted();

  const items = useCartStore((s) => s.items);
  const coupon = useCartStore((s) => s.coupon);
  const deliveryMethod = useCartStore((s) => s.deliveryMethod);
  const setDeliveryMethod = useCartStore((s) => s.setDeliveryMethod);
  const clearCart = useCartStore((s) => s.clearCart);

  const addresses = useAccountStore((s) => s.addresses);
  const addAddress = useAccountStore((s) => s.addAddress);
  const addOrder = useAccountStore((s) => s.addOrder);
  const addNotification = useAccountStore((s) => s.addNotification);

  const [step, setStep] = React.useState(1);
  const [selectedAddressId, setSelectedAddressId] = React.useState<string | null>(null);
  const [showAddressForm, setShowAddressForm] = React.useState(false);
  const [form, setForm] = React.useState(emptyAddressForm);
  const [payment, setPayment] = React.useState<PaymentMethod>("upi");
  const [placing, setPlacing] = React.useState(false);

  React.useEffect(() => {
    if (mounted && addresses.length > 0 && !selectedAddressId) {
      setSelectedAddressId(
        addresses.find((a) => a.isDefault)?.id ?? addresses[0].id
      );
    }
  }, [mounted, addresses, selectedAddressId]);

  if (!mounted) {
    return (
      <div className="container py-8">
        <Skeleton className="h-9 w-48" />
        <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_380px]">
          <Skeleton className="h-96 rounded-2xl" />
          <Skeleton className="h-80 rounded-2xl" />
        </div>
      </div>
    );
  }

  if (items.length === 0 && !placing) {
    return (
      <div className="container py-12">
        <EmptyState
          icon={ShoppingCart}
          title="Nothing to checkout"
          description="Your cart is empty. Add some products before checking out."
          action={
            <Button asChild>
              <Link href="/medicines">Browse Medicines</Link>
            </Button>
          }
        />
      </div>
    );
  }

  const summary = computeSummary(items, coupon, deliveryMethod);
  const selectedAddress = addresses.find((a) => a.id === selectedAddressId);

  const formValid =
    form.fullName.trim() &&
    /^\d{10}$/.test(form.phone.replace(/\s/g, "")) &&
    form.line1.trim() &&
    form.city.trim() &&
    form.state.trim() &&
    /^\d{6}$/.test(form.pincode);

  const saveAddress = () => {
    const address: Address = {
      id: `addr-${Date.now().toString(36)}`,
      label: form.label,
      fullName: form.fullName.trim(),
      phone: form.phone.trim(),
      line1: form.line1.trim(),
      line2: form.line2.trim() || undefined,
      city: form.city.trim(),
      state: form.state.trim(),
      pincode: form.pincode.trim(),
      isDefault: addresses.length === 0,
    };
    addAddress(address);
    setSelectedAddressId(address.id);
    setShowAddressForm(false);
    setForm(emptyAddressForm);
    toast.success("Address saved");
  };

  const placeOrder = async () => {
    if (!selectedAddress) return;
    setPlacing(true);
    // Simulate the payment + order API round trip.
    await new Promise((resolve) => setTimeout(resolve, 1600));
    const order = buildOrder({
      items,
      address: selectedAddress,
      paymentMethod: payment,
      deliveryMethod,
      summary,
    });
    addOrder(order);
    addNotification({
      id: `ntf-${Date.now().toString(36)}`,
      title: "Order placed successfully 🎉",
      body: `Order ${order.id} for ${formatINR(summary.total)} has been placed. We'll notify you as it moves.`,
      date: new Date().toISOString(),
      read: false,
      kind: "order",
    });
    clearCart();
    router.push(`/checkout/success?orderId=${order.id}`);
  };

  return (
    <div className="container py-8">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl font-bold tracking-tight sm:text-3xl">
          Checkout
        </h1>
        <Link
          href="/cart"
          className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
        >
          <ChevronLeft className="h-4 w-4" />
          Back to cart
        </Link>
      </div>

      {/* Stepper */}
      <ol className="mt-6 flex items-center gap-2 sm:gap-4">
        {steps.map((s, i) => (
          <li key={s.id} className="flex flex-1 items-center gap-2 sm:gap-4">
            <button
              type="button"
              onClick={() => s.id < step && setStep(s.id)}
              disabled={s.id > step}
              className="flex items-center gap-2"
            >
              <span
                className={cn(
                  "flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-semibold transition-colors",
                  s.id < step
                    ? "bg-success text-success-foreground"
                    : s.id === step
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground"
                )}
              >
                {s.id < step ? <Check className="h-4 w-4" /> : s.id}
              </span>
              <span
                className={cn(
                  "hidden text-sm font-medium sm:block",
                  s.id === step ? "text-foreground" : "text-muted-foreground"
                )}
              >
                {s.label}
              </span>
            </button>
            {i < steps.length - 1 && (
              <span
                className={cn(
                  "h-0.5 flex-1 rounded-full",
                  s.id < step ? "bg-success" : "bg-muted"
                )}
              />
            )}
          </li>
        ))}
      </ol>

      <div className="mt-8 grid items-start gap-8 lg:grid-cols-[1fr_380px]">
        <div className="rounded-2xl border bg-card p-5 shadow-soft sm:p-6">
          <AnimatePresence mode="wait">
            {/* STEP 1 — ADDRESS */}
            {step === 1 && (
              <motion.div
                key="address"
                initial={{ opacity: 0, x: 24 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -24 }}
                transition={{ duration: 0.25 }}
              >
                <h2 className="flex items-center gap-2 text-lg font-semibold">
                  <MapPin className="h-5 w-5 text-primary" />
                  Delivery Address
                </h2>

                <RadioGroup
                  value={selectedAddressId ?? ""}
                  onValueChange={setSelectedAddressId}
                  className="mt-5 gap-3"
                >
                  {addresses.map((address) => (
                    <Label
                      key={address.id}
                      htmlFor={address.id}
                      className={cn(
                        "flex cursor-pointer items-start gap-3 rounded-xl border p-4 transition-colors",
                        selectedAddressId === address.id
                          ? "border-primary bg-accent/50"
                          : "hover:border-primary/40"
                      )}
                    >
                      <RadioGroupItem value={address.id} id={address.id} className="mt-1" />
                      <div className="text-sm font-normal">
                        <p className="font-semibold">
                          {address.fullName}
                          <span className="ml-2 rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground">
                            {address.label}
                          </span>
                        </p>
                        <p className="mt-1 text-muted-foreground">
                          {address.line1}
                          {address.line2 ? `, ${address.line2}` : ""}, {address.city},{" "}
                          {address.state} — {address.pincode}
                        </p>
                        <p className="mt-0.5 text-muted-foreground">
                          Phone: {address.phone}
                        </p>
                      </div>
                    </Label>
                  ))}
                </RadioGroup>

                {showAddressForm ? (
                  <div className="mt-5 rounded-xl border p-4">
                    <h3 className="text-sm font-semibold">New Address</h3>
                    <div className="mt-4 grid gap-4 sm:grid-cols-2">
                      <div className="space-y-1.5">
                        <Label htmlFor="fullName">Full name</Label>
                        <Input
                          id="fullName"
                          value={form.fullName}
                          onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                          placeholder="Full name"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <Label htmlFor="phone">Phone (10 digits)</Label>
                        <Input
                          id="phone"
                          inputMode="numeric"
                          value={form.phone}
                          onChange={(e) => setForm({ ...form, phone: e.target.value })}
                          placeholder="98765 43210"
                        />
                      </div>
                      <div className="space-y-1.5 sm:col-span-2">
                        <Label htmlFor="line1">Address line 1</Label>
                        <Input
                          id="line1"
                          value={form.line1}
                          onChange={(e) => setForm({ ...form, line1: e.target.value })}
                          placeholder="House no., building, street"
                        />
                      </div>
                      <div className="space-y-1.5 sm:col-span-2">
                        <Label htmlFor="line2">Address line 2 (optional)</Label>
                        <Input
                          id="line2"
                          value={form.line2}
                          onChange={(e) => setForm({ ...form, line2: e.target.value })}
                          placeholder="Locality, landmark"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <Label htmlFor="city">City</Label>
                        <Input
                          id="city"
                          value={form.city}
                          onChange={(e) => setForm({ ...form, city: e.target.value })}
                          placeholder="City"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <Label htmlFor="state">State</Label>
                        <Input
                          id="state"
                          value={form.state}
                          onChange={(e) => setForm({ ...form, state: e.target.value })}
                          placeholder="State"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <Label htmlFor="pincode">Pincode</Label>
                        <Input
                          id="pincode"
                          inputMode="numeric"
                          value={form.pincode}
                          onChange={(e) => setForm({ ...form, pincode: e.target.value })}
                          placeholder="6-digit pincode"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <Label>Save as</Label>
                        <div className="flex gap-2">
                          {(["Home", "Office", "Other"] as const).map((label) => (
                            <button
                              key={label}
                              type="button"
                              onClick={() => setForm({ ...form, label })}
                              className={cn(
                                "rounded-full border px-3 py-1.5 text-xs font-medium transition-colors",
                                form.label === label
                                  ? "border-primary bg-accent text-primary"
                                  : "text-muted-foreground hover:border-primary/40"
                              )}
                            >
                              {label}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="mt-4 flex gap-2">
                      <Button onClick={saveAddress} disabled={!formValid}>
                        Save Address
                      </Button>
                      <Button variant="ghost" onClick={() => setShowAddressForm(false)}>
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <Button
                    variant="outline"
                    className="mt-5"
                    onClick={() => setShowAddressForm(true)}
                  >
                    <Plus className="h-4 w-4" />
                    Add New Address
                  </Button>
                )}

                <Button
                  size="lg"
                  className="mt-6 w-full sm:w-auto"
                  disabled={!selectedAddress}
                  onClick={() => setStep(2)}
                >
                  Deliver to this Address
                </Button>
              </motion.div>
            )}

            {/* STEP 2 — DELIVERY */}
            {step === 2 && (
              <motion.div
                key="delivery"
                initial={{ opacity: 0, x: 24 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -24 }}
                transition={{ duration: 0.25 }}
              >
                <h2 className="flex items-center gap-2 text-lg font-semibold">
                  <Truck className="h-5 w-5 text-primary" />
                  Delivery Method
                </h2>
                <RadioGroup
                  value={deliveryMethod}
                  onValueChange={(v) => setDeliveryMethod(v as "standard" | "express")}
                  className="mt-5 gap-3"
                >
                  <Label
                    htmlFor="standard"
                    className={cn(
                      "flex cursor-pointer items-start gap-3 rounded-xl border p-4 transition-colors",
                      deliveryMethod === "standard"
                        ? "border-primary bg-accent/50"
                        : "hover:border-primary/40"
                    )}
                  >
                    <RadioGroupItem value="standard" id="standard" className="mt-1" />
                    <div className="flex-1 text-sm font-normal">
                      <p className="flex items-center justify-between font-semibold">
                        Standard Delivery
                        <span className="text-success">
                          {summary.total >= 499 ? "FREE" : formatINR(49)}
                        </span>
                      </p>
                      <p className="mt-1 text-muted-foreground">
                        Delivered in 2–3 days · Free above ₹499
                      </p>
                    </div>
                  </Label>
                  <Label
                    htmlFor="express"
                    className={cn(
                      "flex cursor-pointer items-start gap-3 rounded-xl border p-4 transition-colors",
                      deliveryMethod === "express"
                        ? "border-primary bg-accent/50"
                        : "hover:border-primary/40"
                    )}
                  >
                    <RadioGroupItem value="express" id="express" className="mt-1" />
                    <div className="flex-1 text-sm font-normal">
                      <p className="flex items-center justify-between font-semibold">
                        <span className="inline-flex items-center gap-1.5">
                          Express Delivery
                          <Zap className="h-3.5 w-3.5 text-warning" />
                        </span>
                        <span>+ {formatINR(99)}</span>
                      </p>
                      <p className="mt-1 text-muted-foreground">
                        Delivered within 24 hours in metro cities
                      </p>
                    </div>
                  </Label>
                </RadioGroup>
                <div className="mt-6 flex gap-3">
                  <Button variant="outline" onClick={() => setStep(1)}>
                    Back
                  </Button>
                  <Button size="lg" onClick={() => setStep(3)}>
                    Continue to Payment
                  </Button>
                </div>
              </motion.div>
            )}

            {/* STEP 3 — PAYMENT */}
            {step === 3 && (
              <motion.div
                key="payment"
                initial={{ opacity: 0, x: 24 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -24 }}
                transition={{ duration: 0.25 }}
              >
                <h2 className="flex items-center gap-2 text-lg font-semibold">
                  <CreditCard className="h-5 w-5 text-primary" />
                  Payment Method
                </h2>
                <RadioGroup
                  value={payment}
                  onValueChange={(v) => setPayment(v as PaymentMethod)}
                  className="mt-5 gap-3"
                >
                  {paymentOptions.map((option) => (
                    <Label
                      key={option.value}
                      htmlFor={option.value}
                      className={cn(
                        "flex cursor-pointer items-center gap-3 rounded-xl border p-4 transition-colors",
                        payment === option.value
                          ? "border-primary bg-accent/50"
                          : "hover:border-primary/40"
                      )}
                    >
                      <RadioGroupItem value={option.value} id={option.value} />
                      <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                        <option.icon className="h-5 w-5 text-primary" />
                      </span>
                      <div className="text-sm font-normal">
                        <p className="font-semibold">{option.label}</p>
                        <p className="text-muted-foreground">{option.description}</p>
                      </div>
                    </Label>
                  ))}
                </RadioGroup>
                <p className="mt-4 flex items-center gap-2 rounded-lg bg-muted/60 p-3 text-xs text-muted-foreground">
                  <ShieldCheck className="h-4 w-4 shrink-0 text-success" />
                  This is a demo checkout — no real payment is processed.
                </p>
                <div className="mt-6 flex gap-3">
                  <Button variant="outline" onClick={() => setStep(2)}>
                    Back
                  </Button>
                  <Button size="lg" onClick={() => setStep(4)}>
                    Review Order
                  </Button>
                </div>
              </motion.div>
            )}

            {/* STEP 4 — REVIEW */}
            {step === 4 && selectedAddress && (
              <motion.div
                key="review"
                initial={{ opacity: 0, x: 24 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -24 }}
                transition={{ duration: 0.25 }}
              >
                <h2 className="flex items-center gap-2 text-lg font-semibold">
                  <Check className="h-5 w-5 text-primary" />
                  Review Your Order
                </h2>

                <div className="mt-5 space-y-4">
                  <div className="rounded-xl border p-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-semibold">Deliver to</h3>
                      <Button variant="ghost" size="sm" onClick={() => setStep(1)}>
                        Change
                      </Button>
                    </div>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {selectedAddress.fullName} · {selectedAddress.line1},{" "}
                      {selectedAddress.city}, {selectedAddress.state} —{" "}
                      {selectedAddress.pincode}
                    </p>
                  </div>

                  <div className="rounded-xl border p-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-semibold">Payment & delivery</h3>
                      <Button variant="ghost" size="sm" onClick={() => setStep(3)}>
                        Change
                      </Button>
                    </div>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {paymentMethodLabels[payment]} ·{" "}
                      {deliveryMethod === "express"
                        ? "Express delivery (24 hrs)"
                        : "Standard delivery (2–3 days)"}
                    </p>
                  </div>

                  <ul className="divide-y rounded-xl border">
                    {items.map(({ product, quantity }) => (
                      <li key={product.id} className="flex items-center gap-3 p-3.5">
                        <ProductVisual
                          image={product.image}
                          className="h-12 w-12 shrink-0 rounded-lg"
                        />
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-medium">{product.name}</p>
                          <p className="text-xs text-muted-foreground">
                            Qty {quantity} · {product.packSize}
                          </p>
                        </div>
                        <span className="text-sm font-semibold">
                          {formatINR(product.price * quantity)}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-6 flex gap-3">
                  <Button variant="outline" onClick={() => setStep(3)} disabled={placing}>
                    Back
                  </Button>
                  <Button
                    size="lg"
                    variant="gradient"
                    onClick={placeOrder}
                    disabled={placing}
                    className="min-w-48"
                  >
                    {placing ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Placing order…
                      </>
                    ) : (
                      <>Place Order · {formatINR(summary.total)}</>
                    )}
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="lg:sticky lg:top-40">
          <PriceSummaryCard summary={summary} couponCode={coupon?.code} />
        </div>
      </div>
    </div>
  );
}
