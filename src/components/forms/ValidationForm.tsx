import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Mail, Phone } from 'lucide-react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';

const validationSchema = z.object({
  email: z.string().email('Invalid email address').optional().or(z.literal('')),
  phone: z.string().optional(),
}).refine((data) => data.email || data.phone, {
  message: 'Please provide either an email or phone number',
  path: ['email']
});

type ValidationFormData = z.infer<typeof validationSchema>;

interface ValidationFormProps {
  onSubmit: (data: ValidationFormData) => Promise<void>;
  isLoading: boolean;
}

export const ValidationForm: React.FC<ValidationFormProps> = ({ onSubmit, isLoading }) => {
  const { register, handleSubmit, formState: { errors } } = useForm<ValidationFormData>({
    resolver: zodResolver(validationSchema)
  });

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-lg font-semibold mb-4">Validate Lead</h2>
      
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input
          {...register('email')}
          type="email"
          label="Email address"
          icon={<Mail className="w-5 h-5 text-gray-400" />}
          error={errors.email?.message}
          placeholder="Enter email to validate"
        />

        <div className="text-center text-sm text-gray-500">
          OR
        </div>

        <Input
          {...register('phone')}
          type="tel"
          label="Phone number"
          icon={<Phone className="w-5 h-5 text-gray-400" />}
          error={errors.phone?.message}
          placeholder="Enter phone number to validate"
        />

        <Button
          type="submit"
          className="w-full"
          loading={isLoading}
        >
          Validate Lead
        </Button>
      </form>
    </div>
  );
};