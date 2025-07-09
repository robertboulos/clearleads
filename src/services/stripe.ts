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
    const response = await apiClient.post<{
      checkout_url: string;
      session_id: string;
    }>(API_ENDPOINTS.billing.checkout, { 
      package_type: planId  // Backend expects 'package_type', not 'planId'
    });
    
    // Map backend response to frontend interface
    return {
      sessionId: response.data.session_id,
      checkoutUrl: response.data.checkout_url
    };
  },

  async createBillingPortal(): Promise<BillingPortal> {
    const response = await apiClient.post<{
      portal_url: string;
    }>(API_ENDPOINTS.billing.subscriptions.billingPortal);
    
    // Map backend response to frontend interface
    return {
      portalUrl: response.data.portal_url
    };
  },

  redirectToCheckout(sessionId: string) {
    // In a real app, this would redirect to Stripe Checkout
    window.location.href = `https://checkout.stripe.com/pay/${sessionId}`;
  },

  redirectToBillingPortal(portalUrl: string) {
    window.open(portalUrl, '_blank');
  }
};