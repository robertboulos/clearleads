export interface UserProfile {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  plan: PlanType;
  credits: number;
  apiKey: string;
  createdAt: string;
  emailVerified: boolean;
  preferences: {
    notifications: boolean;
    darkMode: boolean;
    language: string;
  };
}

export type PlanType = 'starter' | 'pro' | 'enterprise';

export interface Plan {
  id: PlanType;
  name: string;
  price: number;
  credits: number;
  features: string[];
  popular?: boolean;
}

export interface AuthState {
  user: UserProfile | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}