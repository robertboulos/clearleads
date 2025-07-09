import React from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { AuthLayout } from '../components/layout/AuthLayout';
import { LoginForm } from '../components/forms/LoginForm';
import { useAuthStore } from '../store/authStore';

export const Login: React.FC = () => {
  const navigate = useNavigate();
  const { login, isLoading } = useAuthStore();

  const handleSubmit = async (data: { email: string; password: string }) => {
    try {
      await login(data);
      toast.success('Welcome back!');
      navigate('/dashboard');
    } catch (error: any) {
      toast.error(error.message || 'Login failed');
    }
  };

  return (
    <AuthLayout 
      title="Log in"
      subtitle="The fastest, simplest, and most secure email validation service."
    >
      <LoginForm onSubmit={handleSubmit} isLoading={isLoading} />
    </AuthLayout>
  );
};