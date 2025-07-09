import { apiClient } from './api';
import { API_ENDPOINTS } from '../utils/constants';

export interface CheckoutSession {
  sessionId: string;
  checkoutUrl: string;
}

export interface BillingPortal {
  portalUrl: string;
}

export const stripeService = {
  async createCheckoutSession(planId: string): Promise<CheckoutSession> {
    const response = await apiClient.post<CheckoutSession>(
      API_ENDPOINTS.billing.checkout,
      { planId }
    );
    return response.data;
  },

  async createBillingPortal(): Promise<BillingPortal> {
    const response = await apiClient.post<BillingPortal>(
      API_ENDPOINTS.billing.portal
    );
    return response.data;
  },

  redirectToCheckout(sessionId: string) {
    // In a real app, this would redirect to Stripe Checkout
    window.location.href = `https://checkout.stripe.com/pay/${sessionId}`;
  },

  redirectToBillingPortal(portalUrl: string) {
    window.open(portalUrl, '_blank');
  }
};