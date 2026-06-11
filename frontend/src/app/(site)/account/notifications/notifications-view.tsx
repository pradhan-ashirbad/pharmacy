"use client";

import { Bell, BellOff, CheckCheck, FileText, Package, Tag } from "lucide-react";

import { EmptyState } from "@/components/shared/empty-state";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useMounted } from "@/hooks/use-mounted";
import { cn, formatDateTime } from "@/lib/utils";
import { useAccountStore } from "@/store/account";
import type { AppNotification } from "@/types";

const kindIcons: Record<AppNotification["kind"], typeof Bell> = {
  order: Package,
  offer: Tag,
  prescription: FileText,
  system: Bell,
};

export function NotificationsView() {
  const mounted = useMounted();
  const notifications = useAccountStore((s) => s.notifications);
  const markRead = useAccountStore((s) => s.markNotificationRead);
  const markAllRead = useAccountStore((s) => s.markAllNotificationsRead);

  if (!mounted) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-20 rounded-2xl" />
        ))}
      </div>
    );
  }

  if (notifications.length === 0) {
    return (
      <EmptyState
        icon={BellOff}
        title="No notifications"
        description="Order updates, prescription approvals and offers will appear here."
      />
    );
  }

  const unread = notifications.filter((n) => !n.read).length;

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {unread > 0 ? `${unread} unread` : "All caught up 🎉"}
        </p>
        {unread > 0 && (
          <Button variant="ghost" size="sm" onClick={markAllRead}>
            <CheckCheck className="h-4 w-4" />
            Mark all read
          </Button>
        )}
      </div>
      <ul className="space-y-3">
        {notifications.map((n) => {
          const Icon = kindIcons[n.kind];
          return (
            <li key={n.id}>
              <button
                type="button"
                onClick={() => markRead(n.id)}
                className={cn(
                  "flex w-full items-start gap-4 rounded-2xl border bg-card p-4 text-left shadow-soft transition-colors",
                  !n.read && "border-primary/40 bg-accent/40"
                )}
              >
                <span
                  className={cn(
                    "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl",
                    n.read ? "bg-muted text-muted-foreground" : "bg-accent text-primary"
                  )}
                >
                  <Icon className="h-5 w-5" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className={cn("text-sm", !n.read ? "font-semibold" : "font-medium")}>
                    {n.title}
                  </p>
                  <p className="mt-0.5 text-sm text-muted-foreground">{n.body}</p>
                  <p className="mt-1.5 text-xs text-muted-foreground">
                    {formatDateTime(n.date)}
                  </p>
                </div>
                {!n.read && (
                  <span className="mt-1 h-2.5 w-2.5 shrink-0 rounded-full bg-primary" />
                )}
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
