"use client";

import * as React from "react";
import { MapPin, Pencil, Plus, Star, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { EmptyState } from "@/components/shared/empty-state";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { useMounted } from "@/hooks/use-mounted";
import { cn } from "@/lib/utils";
import { useAccountStore } from "@/store/account";
import type { Address } from "@/types";

const emptyForm = {
  fullName: "",
  phone: "",
  line1: "",
  line2: "",
  city: "",
  state: "",
  pincode: "",
  label: "Home" as Address["label"],
};

export function AddressesView() {
  const mounted = useMounted();
  const addresses = useAccountStore((s) => s.addresses);
  const addAddress = useAccountStore((s) => s.addAddress);
  const updateAddress = useAccountStore((s) => s.updateAddress);
  const removeAddress = useAccountStore((s) => s.removeAddress);
  const setDefaultAddress = useAccountStore((s) => s.setDefaultAddress);

  const [open, setOpen] = React.useState(false);
  const [editingId, setEditingId] = React.useState<string | null>(null);
  const [form, setForm] = React.useState(emptyForm);

  if (!mounted) {
    return (
      <div className="grid gap-4 sm:grid-cols-2">
        {Array.from({ length: 2 }).map((_, i) => (
          <Skeleton key={i} className="h-44 rounded-2xl" />
        ))}
      </div>
    );
  }

  const valid =
    form.fullName.trim() &&
    /^[\d\s]{10,12}$/.test(form.phone.trim()) &&
    form.line1.trim() &&
    form.city.trim() &&
    form.state.trim() &&
    /^\d{6}$/.test(form.pincode.trim());

  const startEdit = (address: Address) => {
    setEditingId(address.id);
    setForm({
      fullName: address.fullName,
      phone: address.phone,
      line1: address.line1,
      line2: address.line2 ?? "",
      city: address.city,
      state: address.state,
      pincode: address.pincode,
      label: address.label,
    });
    setOpen(true);
  };

  const save = () => {
    if (editingId) {
      updateAddress(editingId, {
        ...form,
        line2: form.line2 || undefined,
      });
      toast.success("Address updated");
    } else {
      addAddress({
        id: `addr-${Date.now().toString(36)}`,
        ...form,
        line2: form.line2 || undefined,
        isDefault: addresses.length === 0,
      });
      toast.success("Address added");
    }
    setOpen(false);
    setEditingId(null);
    setForm(emptyForm);
  };

  return (
    <div>
      <div className="mb-5 flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {addresses.length} saved {addresses.length === 1 ? "address" : "addresses"}
        </p>
        <Dialog
          open={open}
          onOpenChange={(v) => {
            setOpen(v);
            if (!v) {
              setEditingId(null);
              setForm(emptyForm);
            }
          }}
        >
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4" />
              Add Address
            </Button>
          </DialogTrigger>
          <DialogContent className="max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingId ? "Edit Address" : "New Address"}</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="a-name">Full name</Label>
                <Input
                  id="a-name"
                  value={form.fullName}
                  onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="a-phone">Phone</Label>
                <Input
                  id="a-phone"
                  inputMode="numeric"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                />
              </div>
              <div className="space-y-1.5 sm:col-span-2">
                <Label htmlFor="a-line1">Address line 1</Label>
                <Input
                  id="a-line1"
                  value={form.line1}
                  onChange={(e) => setForm({ ...form, line1: e.target.value })}
                />
              </div>
              <div className="space-y-1.5 sm:col-span-2">
                <Label htmlFor="a-line2">Address line 2 (optional)</Label>
                <Input
                  id="a-line2"
                  value={form.line2}
                  onChange={(e) => setForm({ ...form, line2: e.target.value })}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="a-city">City</Label>
                <Input
                  id="a-city"
                  value={form.city}
                  onChange={(e) => setForm({ ...form, city: e.target.value })}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="a-state">State</Label>
                <Input
                  id="a-state"
                  value={form.state}
                  onChange={(e) => setForm({ ...form, state: e.target.value })}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="a-pin">Pincode</Label>
                <Input
                  id="a-pin"
                  inputMode="numeric"
                  value={form.pincode}
                  onChange={(e) => setForm({ ...form, pincode: e.target.value })}
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
            <Button onClick={save} disabled={!valid} className="mt-2">
              {editingId ? "Save Changes" : "Add Address"}
            </Button>
          </DialogContent>
        </Dialog>
      </div>

      {addresses.length === 0 ? (
        <EmptyState
          icon={MapPin}
          title="No saved addresses"
          description="Add an address to speed through checkout next time."
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {addresses.map((address) => (
            <div
              key={address.id}
              className={cn(
                "rounded-2xl border bg-card p-5 shadow-soft",
                address.isDefault && "border-primary/50"
              )}
            >
              <div className="flex items-center gap-2">
                <Badge variant={address.isDefault ? "default" : "muted"}>
                  {address.label}
                </Badge>
                {address.isDefault && (
                  <span className="inline-flex items-center gap-1 text-xs font-medium text-primary">
                    <Star className="h-3 w-3 fill-current" />
                    Default
                  </span>
                )}
              </div>
              <p className="mt-3 text-sm font-semibold">{address.fullName}</p>
              <p className="mt-1 text-sm text-muted-foreground">
                {address.line1}
                {address.line2 ? `, ${address.line2}` : ""}
              </p>
              <p className="text-sm text-muted-foreground">
                {address.city}, {address.state} — {address.pincode}
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                Phone: {address.phone}
              </p>
              <div className="mt-4 flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={() => startEdit(address)}>
                  <Pencil className="h-3.5 w-3.5" />
                  Edit
                </Button>
                {!address.isDefault && (
                  <>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setDefaultAddress(address.id);
                        toast.success("Default address updated");
                      }}
                    >
                      Set Default
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      className="ml-auto text-muted-foreground hover:text-destructive"
                      aria-label="Delete address"
                      onClick={() => {
                        removeAddress(address.id);
                        toast("Address removed");
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
