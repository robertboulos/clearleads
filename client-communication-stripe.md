# Stripe Configuration Needed for ClearLeads

## 🚨 Current Issue
The billing system is failing because the Stripe integration is not properly configured. This is blocking users from purchasing credits and subscriptions.

## 🔧 What Needs to Be Done

### Option 1: Grant Developer Access (Recommended)
Jim, please add Robert as a team member to your ClearLeads Stripe account:

1. **Login to Stripe Dashboard** (stripe.com)
2. **Go to Team Settings** 
3. **Add Team Member**: robertjboulos@gmail.com
4. **Grant "Developer" role** (allows product creation and webhook setup)

### Option 2: Jim Creates Products Himself
If you prefer to handle this yourself, here's exactly what needs to be created:

#### **Products to Create in Stripe:**

1. **ClearLeads Starter**
   - Price: $9.00 USD monthly recurring
   - Description: "100 lead validations per month"
   - Metadata: `package_type: starter`

2. **ClearLeads Pro** 
   - Price: $29.00 USD monthly recurring
   - Description: "500 lead validations per month"
   - Metadata: `package_type: pro`

3. **ClearLeads Enterprise**
   - Price: $79.00 USD monthly recurring  
   - Description: "2000 lead validations per month"
   - Metadata: `package_type: enterprise`

#### **Environment Variables Needed:**
After creating products, please provide:
- Stripe Secret Key (starts with `sk_test_` or `sk_live_`)
- Stripe Publishable Key (starts with `pk_test_` or `pk_live_`)
- Product/Price IDs for the 3 plans above

#### **Webhook Configuration:**
Add these webhook endpoints in Stripe:
- `https://api.clearleads.io/api:rKeV8O3i/webhooks/stripe-checkout`
- `https://api.clearleads.io/api:sXZrg4Gz/webhooks/stripe-subscription`

Events to listen for:
- `checkout.session.completed`
- `customer.subscription.created`
- `customer.subscription.updated` 
- `customer.subscription.deleted`
- `invoice.payment_succeeded`
- `invoice.payment_failed`

## ⏰ Timeline
This is blocking the billing functionality. Once configured, users will be able to:
- Purchase credit packages
- Subscribe to monthly plans
- Access the billing portal
- Receive proper billing notifications

## 🎯 Recommended Next Step
**Option 1 (Grant Access)** is fastest and allows us to complete the integration immediately.