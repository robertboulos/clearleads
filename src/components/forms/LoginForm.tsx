import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Mail, Lock } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type LoginFormData = z.infer<typeof loginSchema>;

interface LoginFormProps {
  onSubmit: (data: LoginFormData) => Promise<void>;
  isLoading: boolean;
}

export const LoginForm: React.FC<LoginFormProps> = ({ onSubmit, isLoading }) => {
  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema)
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <Input
        {...register('email')}
        type="email"
        label="Email address"
        icon={<Mail className="w-5 h-5 text-gray-400" />}
        error={errors.email?.message}
        placeholder="Enter your email"
      />

      <Input
        {...register('password')}
        type="password"
        label="Password"
        icon={<Lock className="w-5 h-5 text-gray-400" />}
        error={errors.password?.message}
        placeholder="Enter your password"
      />

      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <input
            id="remember-me"
            name="remember-me"
            type="checkbox"
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
            Remember me
          </label>
        </div>

        <div className="text-sm">
          <Link to="/forgot-password" className="font-medium text-blue-600 hover:text-blue-500">
            Forgot your password?
          </Link>
        </div>
      </div>

      <Button
        type="submit"
        className="w-full"
        loading={isLoading}
      >
        Sign in
      </Button>

      <div className="text-center">
        <span className="text-sm text-gray-600">
          Don't have an account?{' '}
          <Link to="/register" className="font-medium text-blue-600 hover:text-blue-500">
            Sign up
          </Link>
        </span>
      </div>
    </form>
  );
};