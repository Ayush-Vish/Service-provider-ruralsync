import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Bell, Briefcase, CheckCheck, CircleCheckBig, CircleDashed, Clock3, UserRound } from "lucide-react";

import { SHOPKEEPER_BASE_URL } from "@/constants";
import axiosInstance from "@/lib/axios";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

type NotificationTone = "info" | "success" | "warning";

interface ProviderBookingNotification {
  id: string;
  bookingId: string;
  title: string;
  body: string;
  route: string;
  createdAt: string;
  tone: NotificationTone;
}

interface ProviderBooking {
  _id: string;
  status: string;
  bookingTime: string;
  createdAt: string;
  updatedAt: string;
  service?: {
    name?: string;
  };
  client?: {
    name?: string;
  };
  assignedAgents?: Array<unknown>;
}

const STORAGE_KEY = "ruralsync-provider-notification-read";

function formatRelativeTime(value: string) {
  const timestamp = new Date(value).getTime();
  if (Number.isNaN(timestamp)) return "Just now";

  const diffMinutes = Math.round((Date.now() - timestamp) / 60000);
  if (diffMinutes < 1) return "Just now";
  if (diffMinutes < 60) return `${diffMinutes}m ago`;

  const diffHours = Math.round(diffMinutes / 60);
  if (diffHours < 24) return `${diffHours}h ago`;

  const diffDays = Math.round(diffHours / 24);
  if (diffDays < 7) return `${diffDays}d ago`;

  return new Date(value).toLocaleDateString();
}

function buildNotification(booking: ProviderBooking): Omit<ProviderBookingNotification, "id" | "bookingId" | "createdAt"> {
  const serviceName = booking.service?.name || "Service";
  const clientName = booking.client?.name || "Customer";
  const assignedCount = booking.assignedAgents?.length || 0;
  const status = booking.status?.toUpperCase();

  if ((status === "PENDING" || status === "CONFIRMED") && assignedCount === 0) {
    return {
      title: `${serviceName} needs assignment`,
      body: `${clientName} booked ${serviceName}. Assign an agent for the ${booking.bookingTime} slot.`,
      route: "/bookings",
      tone: "warning",
    };
  }

  if (status === "IN_PROGRESS") {
    return {
      title: `${serviceName} is live`,
      body: `${clientName}'s booking is currently in progress. Check tracking and field status if needed.`,
      route: "/bookings",
      tone: "info",
    };
  }

  if (status === "COMPLETED") {
    return {
      title: `${serviceName} completed`,
      body: `${clientName}'s booking has been completed and is ready for follow-up.`,
      route: "/bookings",
      tone: "success",
    };
  }

  return {
    title: `New ${serviceName} booking`,
    body: `${clientName} booked ${serviceName}. Review the request in your bookings queue.`,
    route: "/bookings",
    tone: "info",
  };
}

function getToneStyles(tone: NotificationTone) {
  switch (tone) {
    case "success":
      return {
        icon: CircleCheckBig,
        wrapper: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300",
        border: "border-emerald-200/70 dark:border-emerald-900/40",
      };
    case "warning":
      return {
        icon: Clock3,
        wrapper: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300",
        border: "border-amber-200/70 dark:border-amber-900/40",
      };
    default:
      return {
        icon: Briefcase,
        wrapper: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300",
        border: "border-blue-200/70 dark:border-blue-900/40",
      };
  }
}

export function NotificationCenter() {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState<ProviderBookingNotification[]>([]);
  const [readIds, setReadIds] = useState<string[]>([]);

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setReadIds(JSON.parse(stored));
      }
    } catch {
      setReadIds([]);
    }
  }, []);

  useEffect(() => {
    const loadNotifications = async () => {
      try {
        const res = await axiosInstance.get(SHOPKEEPER_BASE_URL + "bookings");
        const bookings = Array.isArray(res.data?.data) ? res.data.data : [];
        const items = bookings
          .slice()
          .sort((a: ProviderBooking, b: ProviderBooking) =>
            new Date(b.updatedAt || b.createdAt).getTime() - new Date(a.updatedAt || a.createdAt).getTime()
          )
          .slice(0, 10)
          .map((booking: ProviderBooking) => {
            const notification = buildNotification(booking);
            return {
              id: `${booking._id}:${booking.status}:${booking.updatedAt || booking.createdAt}`,
              bookingId: booking._id,
              createdAt: booking.updatedAt || booking.createdAt,
              ...notification,
            };
          });

        setNotifications(items);
      } catch (error) {
        console.error("Failed to load provider notifications:", error);
        setNotifications([]);
      }
    };

    loadNotifications();
  }, []);

  const unreadCount = notifications.filter((item) => !readIds.includes(item.id)).length;

  const persistReadIds = (next: string[]) => {
    setReadIds(next);
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {
      // Ignore storage failures.
    }
  };

  const markAsRead = (id: string) => {
    if (readIds.includes(id)) return;
    persistReadIds([...readIds, id]);
  };

  const markAllAsRead = () => {
    persistReadIds(notifications.map((item) => item.id));
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-medium text-primary-foreground">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent className="sm:max-w-md">
        <SheetHeader className="pr-6">
          <div className="flex items-start justify-between gap-3">
            <div>
              <SheetTitle>Notifications</SheetTitle>
              <SheetDescription>
                Booking activity and assignments that need attention.
              </SheetDescription>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 px-2 text-xs"
              onClick={markAllAsRead}
              disabled={notifications.length === 0}
            >
              <CheckCheck className="mr-1 h-4 w-4" />
              Mark all read
            </Button>
          </div>
        </SheetHeader>
        <Separator className="my-4" />
        <ScrollArea className="h-[calc(100vh-140px)] pr-3">
          {notifications.length === 0 ? (
            <div className="flex h-48 flex-col items-center justify-center text-center">
              <div className="mb-3 rounded-full bg-muted p-3">
                <CircleDashed className="h-5 w-5 text-muted-foreground" />
              </div>
              <p className="font-medium">No notifications yet</p>
              <p className="mt-1 max-w-xs text-sm text-muted-foreground">
                New bookings and operational updates will appear here.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {notifications.map((item) => {
                const unread = !readIds.includes(item.id);
                const tone = getToneStyles(item.tone);
                const Icon = tone.icon;

                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => {
                      markAsRead(item.id);
                      navigate(item.route);
                    }}
                    className={cn(
                      "w-full rounded-2xl border p-4 text-left transition-colors hover:bg-muted/50",
                      unread ? tone.border : "border-border bg-muted/40"
                    )}
                  >
                    <div className="flex gap-3">
                      <div className={cn("mt-0.5 rounded-xl p-2", tone.wrapper)}>
                        <Icon className="h-4 w-4" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-start justify-between gap-2">
                          <p className="font-medium leading-5">{item.title}</p>
                          <span className="shrink-0 text-[11px] text-muted-foreground">
                            {formatRelativeTime(item.createdAt)}
                          </span>
                        </div>
                        <p className="mt-1 text-sm leading-5 text-muted-foreground">
                          {item.body}
                        </p>
                        <div className="mt-3 flex items-center gap-2">
                          {unread && <span className="h-2 w-2 rounded-full bg-primary" />}
                          <Badge variant="secondary" className="gap-1 rounded-full">
                            <UserRound className="h-3 w-3" />
                            Open bookings
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}
