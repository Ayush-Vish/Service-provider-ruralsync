import { useEffect, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useBillingStore, type BillingPlanId } from "@/stores/billing.store";
import { AlertCircle, BadgeIndianRupee, Check, CreditCard, Eye, Loader2, ShieldCheck, Users, Wrench } from "lucide-react";
import toast from "react-hot-toast";

declare global {
  interface Window {
    Razorpay?: new (options: Record<string, unknown>) => {
      open: () => void;
    };
  }
}

const PLAN_ORDER: BillingPlanId[] = ["STARTER", "GROWTH", "PRO"];

function formatMoney(amountInPaise: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amountInPaise / 100);
}

function loadRazorpayScript() {
  return new Promise<boolean>((resolve) => {
    if (window.Razorpay) {
      resolve(true);
      return;
    }

    const existingScript = document.querySelector('script[data-razorpay="true"]');
    if (existingScript) {
      existingScript.addEventListener("load", () => resolve(true));
      existingScript.addEventListener("error", () => resolve(false));
      return;
    }

    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.dataset.razorpay = "true";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

export default function BillingPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const selectedPlan = (searchParams.get("plan") || "").toUpperCase() as BillingPlanId;

  const overview = useBillingStore((state) => state.overview);
  const isLoading = useBillingStore((state) => state.isLoading);
  const activeCheckoutPlan = useBillingStore((state) => state.activeCheckoutPlan);
  const getOverview = useBillingStore((state) => state.getOverview);
  const createOrder = useBillingStore((state) => state.createOrder);
  const verifyPayment = useBillingStore((state) => state.verifyPayment);

  useEffect(() => {
    getOverview();
  }, [getOverview]);

  const sortedPlans = useMemo(() => {
    if (!overview) return [];
    return [...overview.plans].sort(
      (a, b) => PLAN_ORDER.indexOf(a.planId) - PLAN_ORDER.indexOf(b.planId)
    );
  }, [overview]);

  const handleCheckout = async (planId: BillingPlanId) => {
    const scriptReady = await loadRazorpayScript();
    if (!scriptReady || !window.Razorpay) {
      toast.error("Unable to load the payment gateway right now");
      return;
    }

    const order = await createOrder(planId);
    if (!order) {
      return;
    }

    const razorpay = new window.Razorpay({
      key: order.keyId,
      amount: order.amount,
      currency: order.currency,
      name: "RuralSync Provider",
      description: `${planId} monthly provider plan`,
      order_id: order.orderId,
      prefill: {
        name: order.provider.name,
        email: order.provider.email,
      },
      notes: {
        planId: order.planId,
      },
      theme: {
        color: "#16a34a",
      },
      handler: async (response: Record<string, string>) => {
        const success = await verifyPayment({
          planId,
          razorpay_order_id: response.razorpay_order_id,
          razorpay_payment_id: response.razorpay_payment_id,
          razorpay_signature: response.razorpay_signature,
        });

        if (success) {
          setSearchParams((prev) => {
            const next = new URLSearchParams(prev);
            next.delete("plan");
            return next;
          });
        }
      },
    });

    razorpay.open();
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-3">
          <Badge className="bg-emerald-100 text-emerald-800 hover:bg-emerald-100 dark:bg-emerald-900/30 dark:text-emerald-300">
            Billing
          </Badge>
          {overview?.razorpayMode && (
            <Badge variant={overview.razorpayMode === "test" ? "secondary" : "destructive"}>
              {overview.razorpayMode === "test" ? "Razorpay Test Mode" : "Razorpay Live Mode"}
            </Badge>
          )}
          {selectedPlan && (
            <Badge variant="outline">
              Selected plan: {selectedPlan}
            </Badge>
          )}
        </div>
        <h1 className="text-3xl font-bold tracking-tight">Plans & Billing</h1>
        <p className="text-muted-foreground">
          Activate a provider plan, unlock higher limits, and manage your monthly billing in one place.
        </p>
      </div>

      {overview?.razorpayMode === "test" && (
        <Card className="border-amber-200 bg-amber-50/80 dark:border-amber-900/40 dark:bg-amber-950/20">
          <CardContent className="flex flex-col gap-2 p-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="font-medium text-amber-900 dark:text-amber-100">Tester note</p>
              <p className="text-sm text-amber-800/90 dark:text-amber-200/80">
                This checkout is in Razorpay test mode. Use test card <span className="font-semibold">4100 2800 0000 1007</span> to complete payment safely.
              </p>
            </div>
            <Badge variant="secondary" className="w-fit bg-amber-100 text-amber-900 hover:bg-amber-100 dark:bg-amber-900/40 dark:text-amber-100">
              No real charge
            </Badge>
          </CardContent>
        </Card>
      )}

      {isLoading && !overview ? (
        <div className="grid gap-4 lg:grid-cols-[1fr_2fr]">
          <Skeleton className="h-64 rounded-3xl" />
          <div className="grid gap-4 md:grid-cols-3">
            <Skeleton className="h-80 rounded-3xl" />
            <Skeleton className="h-80 rounded-3xl" />
            <Skeleton className="h-80 rounded-3xl" />
          </div>
        </div>
      ) : !overview ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center gap-4 py-16 text-center">
            <AlertCircle className="h-10 w-10 text-muted-foreground" />
            <div>
              <h2 className="text-xl font-semibold">Unable to load billing details</h2>
              <p className="text-muted-foreground">Please refresh and try again.</p>
            </div>
            <Button onClick={() => getOverview()}>Retry</Button>
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr_0.9fr]">
            <Card className="overflow-hidden border-emerald-200/70 bg-gradient-to-br from-emerald-50 via-white to-green-50 shadow-sm">
              <CardHeader>
                <CardDescription>Current subscription</CardDescription>
                <CardTitle className="flex items-center gap-3 text-2xl">
                  <CreditCard className="h-6 w-6 text-emerald-600" />
                  {overview.currentSubscription.planId === "FREE"
                    ? "Free plan"
                    : `${overview.currentSubscription.planId} plan`}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-5">
                <div className="flex flex-wrap gap-2">
                  <Badge variant="secondary">{overview.currentSubscription.status}</Badge>
                  <Badge variant="outline">{overview.currentSubscription.visibilityTier} visibility</Badge>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="rounded-2xl border bg-background/80 p-4">
                    <p className="text-sm text-muted-foreground">Current monthly price</p>
                    <p className="mt-1 text-2xl font-bold">
                      {overview.currentSubscription.amount
                        ? formatMoney(overview.currentSubscription.amount)
                        : "₹0"}
                    </p>
                  </div>
                  <div className="rounded-2xl border bg-background/80 p-4">
                    <p className="text-sm text-muted-foreground">Billing period ends</p>
                    <p className="mt-1 text-lg font-semibold">
                      {overview.currentSubscription.billingPeriodEnd
                        ? new Date(overview.currentSubscription.billingPeriodEnd).toLocaleDateString("en-IN", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })
                        : "Not active yet"}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardDescription>Usage this cycle</CardDescription>
                <CardTitle>Current usage</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-4">
                <div className="rounded-2xl border p-4">
                  <div className="flex items-center gap-3">
                    <Wrench className="h-5 w-5 text-primary" />
                    <div>
                      <p className="text-sm text-muted-foreground">Services</p>
                      <p className="text-2xl font-bold">{overview.usage.services}</p>
                    </div>
                  </div>
                </div>
                <div className="rounded-2xl border p-4">
                  <div className="flex items-center gap-3">
                    <Users className="h-5 w-5 text-primary" />
                    <div>
                      <p className="text-sm text-muted-foreground">Agents</p>
                      <p className="text-2xl font-bold">{overview.usage.agents}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardDescription>Recent transactions</CardDescription>
                <CardTitle>Payment activity</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {overview.recentPayments.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No payment records yet.</p>
                ) : (
                  overview.recentPayments.map((payment) => (
                    <div key={payment._id} className="rounded-2xl border p-4">
                      <div className="flex items-center justify-between gap-3">
                        <div>
                          <p className="font-medium">{payment.planId}</p>
                          <p className="text-xs text-muted-foreground">
                            {new Date(payment.createdAt).toLocaleDateString("en-IN", {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            })}
                          </p>
                        </div>
                        <Badge variant={payment.status === "CAPTURED" ? "default" : "secondary"}>
                          {payment.status}
                        </Badge>
                      </div>
                      <p className="mt-3 text-sm font-semibold">{formatMoney(payment.amount)}</p>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>
          </div>

          <div className="space-y-4">
            <div>
              <h2 className="text-2xl font-bold tracking-tight">Choose your plan</h2>
              <p className="text-muted-foreground">
                Move up a tier when you need more services, more agents, or stronger marketplace visibility.
              </p>
            </div>

            <div className="grid gap-4 xl:grid-cols-3">
              {sortedPlans.map((plan) => {
                const isCurrentPlan = overview.currentSubscription.planId === plan.planId;
                const isSelectedPlan = selectedPlan === plan.planId;
                const isFeatured = plan.planId === "GROWTH";

                return (
                  <Card
                    key={plan.planId}
                    className={`relative overflow-hidden border transition-all ${
                      isFeatured
                        ? "border-emerald-300 shadow-lg shadow-emerald-100/70"
                        : "border-border/70"
                    } ${isSelectedPlan ? "ring-2 ring-primary/30" : ""}`}
                  >
                    {isFeatured && (
                      <div className="absolute right-4 top-4">
                        <Badge className="bg-emerald-600 text-white hover:bg-emerald-600">Most popular</Badge>
                      </div>
                    )}
                    <CardHeader className="pb-4">
                      <CardDescription>{plan.planId}</CardDescription>
                      <CardTitle className="text-2xl">{plan.label}</CardTitle>
                      <div className="flex items-end gap-2 pt-2">
                        <span className="text-4xl font-bold">{formatMoney(plan.amount)}</span>
                        <span className="pb-1 text-sm text-muted-foreground">/ month</span>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="rounded-2xl border bg-muted/30 px-4 py-3 text-sm">
                        <div className="flex items-center gap-3">
                          <Wrench className="h-4 w-4 text-primary" />
                          <span>{plan.services >= 999999 ? "Unlimited services" : `Up to ${plan.services} services`}</span>
                        </div>
                      </div>
                      <div className="rounded-2xl border bg-muted/30 px-4 py-3 text-sm">
                        <div className="flex items-center gap-3">
                          <Users className="h-4 w-4 text-primary" />
                          <span>Up to {plan.agents} agents</span>
                        </div>
                      </div>
                      <div className="rounded-2xl border bg-muted/30 px-4 py-3 text-sm">
                        <div className="flex items-center gap-3">
                          <Eye className="h-4 w-4 text-primary" />
                          <span>{plan.visibility} visibility</span>
                        </div>
                      </div>
                      <div className="rounded-2xl border bg-muted/30 px-4 py-3 text-sm">
                        <div className="flex items-center gap-3">
                          <BadgeIndianRupee className="h-4 w-4 text-primary" />
                          <span>Bookings and dashboard tools included</span>
                        </div>
                      </div>

                      <Button
                        className="mt-4 w-full"
                        onClick={() => handleCheckout(plan.planId)}
                        disabled={activeCheckoutPlan === plan.planId || !overview.razorpayKeyId || isCurrentPlan}
                      >
                        {activeCheckoutPlan === plan.planId ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Processing...
                          </>
                        ) : isCurrentPlan ? (
                          <>
                            <Check className="mr-2 h-4 w-4" />
                            Current plan
                          </>
                        ) : (
                          <>
                            <ShieldCheck className="mr-2 h-4 w-4" />
                            Activate {plan.label}
                          </>
                        )}
                      </Button>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
