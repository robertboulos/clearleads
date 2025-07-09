import { format, formatDistanceToNow } from 'date-fns';

export const formatDate = (date: string | Date) => {
  const dateObj = new Date(date);
  if (isNaN(dateObj.getTime())) {
    return 'N/A';
  }
  return format(dateObj, 'MMM d, yyyy');
};

export const formatDateTime = (date: string | Date) => {
  const dateObj = new Date(date);
  if (isNaN(dateObj.getTime())) {
    return 'N/A';
  }
  return format(dateObj, 'MMM d, yyyy h:mm a');
};

export const formatRelativeTime = (date: string | Date) => {
  const dateObj = new Date(date);
  if (isNaN(dateObj.getTime())) {
    return 'N/A';
  }
  return formatDistanceToNow(dateObj, { addSuffix: true });
};

export const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(amount);
};

export const formatNumber = (number: number) => {
  return new Intl.NumberFormat('en-US').format(number);
};

export const formatPercentage = (value: number, decimals = 1) => {
  return `${(value * 100).toFixed(decimals)}%`;
};

export const truncateText = (text: string, maxLength: number) => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

export const generateApiKey = () => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = 'cl_';
  for (let i = 0; i < 32; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};