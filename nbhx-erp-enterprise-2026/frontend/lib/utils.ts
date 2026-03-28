import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(value: number, currency = 'USD'): string {
  return new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency,
  }).format(value);
}

export function formatNumber(value: number, decimals = 2): string {
  return new Intl.NumberFormat('es-MX', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value);
}

export function formatDate(date: Date | string): string {
  return new Intl.DateTimeFormat('es-MX', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(new Date(date));
}

export function formatDateTime(date: Date | string): string {
  return new Intl.DateTimeFormat('es-MX', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(date));
}

export function formatPercentage(value: number, decimals = 1): string {
  return `${value.toFixed(decimals)}%`;
}

export function calculateOEE(
  availability: number,
  performance: number,
  quality: number
): number {
  return (availability * performance * quality) / 10000;
}

export function getStatusColor(status: string): string {
  const colors: Record<string, string> = {
    RUNNING: 'bg-green-500',
    ACTIVE: 'bg-green-500',
    COMPLETED: 'bg-green-500',
    IDLE: 'bg-yellow-500',
    PENDING: 'bg-yellow-500',
    DOWN: 'bg-red-500',
    ERROR: 'bg-red-500',
    FAILED: 'bg-red-500',
    SETUP: 'bg-blue-500',
    IN_PROGRESS: 'bg-blue-500',
    MAINTENANCE: 'bg-orange-500',
    ON_HOLD: 'bg-gray-500',
    CANCELLED: 'bg-gray-500',
  };
  return colors[status] || 'bg-gray-500';
}

export function getPriorityColor(priority: string): string {
  const colors: Record<string, string> = {
    LOW: 'bg-gray-500',
    MEDIUM: 'bg-blue-500',
    HIGH: 'bg-orange-500',
    CRITICAL: 'bg-red-500',
  };
  return colors[priority] || 'bg-gray-500';
}

export function debounce<T extends (...args: any[]) => void>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}
