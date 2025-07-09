import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Mail, Lock, User } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';

const registerSchema = z.object({
  name: z.string().min(1, 'Name is required').min(2, 'Name must be at least 2 characters'),
  email: z.string().min(1, 'Email is required').email('Invalid email address'),
  password: z.string().min(1, 'Password is required').min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string().min(1, 'Please confirm your password'),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type RegisterFormData = z.infer<typeof registerSchema>;

interface RegisterFormProps {
  onSubmit: (data: Omit<RegisterFormData, 'confirmPassword'>) => Promise<void>;
  isLoading: boolean;
}

export const RegisterForm: React.FC<RegisterFormProps> = ({ onSubmit, isLoading }) => {
  const { 
    register, 
    handleSubmit, 
    formState: { errors },
    watch
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: ''
    }
  });

  const handleFormSubmit = (data: RegisterFormData) => {
    const { confirmPassword, ...submitData } = data;
    return onSubmit(submitData);
  };

  // Watch form values for debugging
  const watchedValues = watch();
  console.log('Register form values:', watchedValues);
  console.log('Register form errors:', errors);

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      <Input
        {...register('name')}
        type="text"
        label="Full name"
        icon={<User className="w-5 h-5 text-gray-400" />}
        error={errors.name?.message}
        placeholder="Enter your full name"
        autoComplete="name"
      />

      <Input
        {...register('email')}
        type="email"
        label="Email address"
        icon={<Mail className="w-5 h-5 text-gray-400" />}
        error={errors.email?.message}
        placeholder="Enter your email"
        autoComplete="email"
      />

      <Input
        {...register('password')}
        type="password"
        label="Password"
        icon={<Lock className="w-5 h-5 text-gray-400" />}
        error={errors.password?.message}
        placeholder="Enter your password"
        autoComplete="new-password"
      />

      <Input
        {...register('confirmPassword')}
        type="password"
        label="Confirm password"
        icon={<Lock className="w-5 h-5 text-gray-400" />}
        error={errors.confirmPassword?.message}
        placeholder="Confirm your password"
        autoComplete="new-password"
      />

      <div className="flex items-center">
        <input
          id="agree-terms"
          name="agree-terms"
          type="checkbox"
          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          required
        />
        <label htmlFor="agree-terms" className="ml-2 block text-sm text-gray-900">
          I agree to the{' '}
          <Link to="/terms" className="text-blue-600 hover:text-blue-500">
            Terms of Service
          </Link>{' '}
          and{' '}
          <Link to="/privacy" className="text-blue-600 hover:text-blue-500">
            Privacy Policy
          </Link>
        </label>
      </div>

      <Button
        type="submit"
        className="w-full"
        loading={isLoading}
      >
        Create account
      </Button>

      <div className="text-center">
        <span className="text-sm text-gray-600">
          Already have an account?{' '}
          <Link to="/login" className="font-medium text-blue-600 hover:text-blue-500">
            Sign in
          </Link>
        </span>
      </div>
    </form>
  );
};