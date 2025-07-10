import { apiClient } from './api';
import { API_ENDPOINTS } from '../utils/constants';

export interface CreditBalance {
  balance: number;
  transactions: CreditTransaction[];
}

export interface CreditTransaction {
  id: number;
  transaction_type: 'usage' | 'purchase' | 'renewal' | 'refund';
  amount: number;
  balance_after: number;
  source: 'api_usage' | 'stripe_checkout' | 'stripe_subscription' | 'manual';
  reference_id: string;
  notes: string;
  created_at: string;
}

export interface CheckoutSessionRequest {
  package_type: 'starter' | 'pro' | 'enterprise';
}

export interface CheckoutSessionResponse {
  success: boolean;
  checkout_url: string;
  session_id: string;
  package: string;
  credits: number;
}

export interface SubscriptionRequest {
  plan_id: number;
}

export interface SubscriptionResponse {
  success: boolean;
  checkout_url: string;
  session_id: string;
}

export interface SubscriptionStatus {
  has_subscription: boolean;
  plan?: {
    id: number;
    name: string;
    monthly_credits: number;
    price: number;
  };
  status: 'active' | 'inactive' | 'canceled' | 'past_due';
  next_renewal?: string;
  current_period_end?: string;
}

export interface BillingPortalResponse {
  portal_url: string;
}

export const billingService = {
  async getCreditBalance(): Promise<CreditBalance> {
    const response = await apiClient.get<CreditBalance>(
      API_ENDPOINTS.billing.balance
    );
    return response.data;
  },

  async createCheckoutSession(request: CheckoutSessionRequest): Promise<CheckoutSessionResponse> {
    const response = await apiClient.post<CheckoutSessionResponse>(
      API_ENDPOINTS.billing.checkout,
      request
    );
    return response.data;
  },

  async createSubscription(request: SubscriptionRequest): Promise<SubscriptionResponse> {
    const response = await apiClient.post<SubscriptionResponse>(
      API_ENDPOINTS.billing.subscriptions.create,
      request
    );
    return response.data;
  },

  async getSubscriptionStatus(): Promise<SubscriptionStatus> {
    const response = await apiClient.get<SubscriptionStatus>(
      API_ENDPOINTS.billing.subscriptions.status
    );
    return response.data;
  },

  async createBillingPortal(): Promise<BillingPortalResponse> {
    const response = await apiClient.post<BillingPortalResponse>(
      API_ENDPOINTS.billing.subscriptions.billingPortal
    );
    return response.data;
  },

  // Redirect to Stripe Checkout
  redirectToCheckout(checkoutUrl: string): void {
    window.location.href = checkoutUrl;
  },

  // Redirect to Stripe Billing Portal
  redirectToBillingPortal(portalUrl: string): void {
    window.location.href = portalUrl;
  }
};