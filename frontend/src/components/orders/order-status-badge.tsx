import { Badge } from "@/components/ui/badge";
import type { OrderStatus, PrescriptionStatus } from "@/types";

export function OrderStatusBadge({ status }: { status: OrderStatus }) {
  const map: Record<OrderStatus, { label: string; variant: "default" | "secondary" | "success" | "warning" | "destructive" | "soft" | "muted" }> = {
    placed: { label: "Order Placed", variant: "soft" },
    confirmed: { label: "Confirmed", variant: "default" },
    packed: { label: "Packed", variant: "secondary" },
    shipped: { label: "Shipped", variant: "secondary" },
    "out-for-delivery": { label: "Out for Delivery", variant: "warning" },
    delivered: { label: "Delivered", variant: "success" },
    cancelled: { label: "Cancelled", variant: "destructive" },
  };
  const { label, variant } = map[status];
  return <Badge variant={variant}>{label}</Badge>;
}

export function PrescriptionStatusBadge({ status }: { status: PrescriptionStatus }) {
  const map: Record<
    PrescriptionStatus,
    { label: string; variant: "soft" | "warning" | "success" | "destructive" }
  > = {
    uploaded: { label: "Uploaded", variant: "soft" },
    "under-review": { label: "Under Review", variant: "warning" },
    approved: { label: "Approved", variant: "success" },
    rejected: { label: "Rejected", variant: "destructive" },
  };
  const { label, variant } = map[status];
  return <Badge variant={variant}>{label}</Badge>;
}
