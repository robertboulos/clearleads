import React from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { AuthLayout } from '../components/layout/AuthLayout';
import { RegisterForm } from '../components/forms/RegisterForm';
import { useAuthStore } from '../store/authStore';

export const Register: React.FC = () => {
  const navigate = useNavigate();
  const { register, isLoading } = useAuthStore();

  const handleSubmit = async (data: { name: string; email: string; password: string }) => {
    try {
      await register(data);
      toast.success('Account created successfully!');
      navigate('/dashboard');
    } catch (error: any) {
      toast.error(error.message || 'Registration failed');
    }
  };

  return (
    <AuthLayout 
      title="Sign Up"
      subtitle="The fastest, simplest, and most secure email validation service."
    >
      <RegisterForm onSubmit={handleSubmit} isLoading={isLoading} />
    </AuthLayout>
  );
};