import { create } from "zustand";
import toast from "react-hot-toast";
import axiosInstance from "@/lib/axios";
import { SHOPKEEPER_BASE_URL } from "@/constants";

export type BillingPlanId = "STARTER" | "GROWTH" | "PRO";

export interface BillingPlan {
  planId: BillingPlanId;
  label: string;
  amount: number;
  currency: string;
  services: number;
  agents: number;
  visibility: "STANDARD" | "PRIORITY" | "FEATURED";
}

export interface BillingOverview {
  provider: {
    name: string;
    email: string;
    organizationName: string | null;
  };
  currentSubscription: {
    planId: "FREE" | BillingPlanId;
    status: "INACTIVE" | "PENDING" | "ACTIVE" | "FAILED";
    amount: number;
    visibilityTier: "STANDARD" | "PRIORITY" | "FEATURED";
    maxServices: number;
    maxAgents: number;
    billingPeriodStart?: string;
    billingPeriodEnd?: string;
    lastPaymentAt?: string;
  };
  usage: {
    services: number;
    agents: number;
  };
  plans: BillingPlan[];
  recentPayments: Array<{
    _id: string;
    planId: BillingPlanId;
    amount: number;
    currency: string;
    status: "CREATED" | "CAPTURED" | "FAILED";
    orderId: string;
    paymentId?: string;
    createdAt: string;
  }>;
  razorpayKeyId: string;
  razorpayMode: "test" | "live";
}

interface BillingOrderResponse {
  orderId: string;
  amount: number;
  currency: string;
  receipt: string;
  planId: BillingPlanId;
  keyId: string;
  provider: {
    name: string;
    email: string;
  };
}

interface BillingState {
  overview: BillingOverview | null;
  isLoading: boolean;
  activeCheckoutPlan: BillingPlanId | null;
  getOverview: () => Promise<boolean>;
  createOrder: (planId: BillingPlanId) => Promise<BillingOrderResponse | null>;
  verifyPayment: (payload: {
    planId: BillingPlanId;
    razorpay_order_id: string;
    razorpay_payment_id: string;
    razorpay_signature: string;
  }) => Promise<boolean>;
}

export const useBillingStore = create<BillingState>((set, get) => ({
  overview: null,
  isLoading: false,
  activeCheckoutPlan: null,

  getOverview: async () => {
    set({ isLoading: true });
    try {
      const res = await axiosInstance.get(`${SHOPKEEPER_BASE_URL}billing`);
      set({
        overview: res.data.data,
        isLoading: false,
      });
      return true;
    } catch (error) {
      console.error("Failed to fetch billing overview", error);
      toast.error("Failed to load billing details");
      set({ isLoading: false });
      return false;
    }
  },

  createOrder: async (planId) => {
    set({ activeCheckoutPlan: planId });
    try {
      const res = await axiosInstance.post(`${SHOPKEEPER_BASE_URL}billing/create-order`, {
        planId,
      });
      return res.data.data as BillingOrderResponse;
    } catch (error: any) {
      console.error("Failed to create billing order", error);
      toast.error(error?.response?.data?.message || "Unable to start payment");
      return null;
    } finally {
      set({ activeCheckoutPlan: null });
    }
  },

  verifyPayment: async (payload) => {
    set({ activeCheckoutPlan: payload.planId });
    try {
      await axiosInstance.post(`${SHOPKEEPER_BASE_URL}billing/verify`, payload);
      toast.success("Plan activated successfully");
      await get().getOverview();
      return true;
    } catch (error: any) {
      console.error("Failed to verify payment", error);
      toast.error(error?.response?.data?.message || "Payment verification failed");
      return false;
    } finally {
      set({ activeCheckoutPlan: null });
    }
  },
}));
