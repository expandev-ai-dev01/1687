import { cn } from '@/core/utils/cn';
import type { ErrorMessageProps } from './types';

export const ErrorMessage = ({ title, message, onRetry, onBack, className }: ErrorMessageProps) => {
  return (
    <div className={cn('flex flex-col items-center justify-center p-8 text-center', className)}>
      <div className="mb-4 text-red-500">
        <svg className="h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
          />
        </svg>
      </div>
      <h2 className="mb-2 text-2xl font-bold text-gray-900">{title}</h2>
      <p className="mb-6 text-gray-600">{message}</p>
      <div className="flex gap-4">
        {onRetry && (
          <button
            onClick={onRetry}
            className="rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
          >
            Try Again
          </button>
        )}
        {onBack && (
          <button
            onClick={onBack}
            className="rounded-md border border-gray-300 px-4 py-2 text-gray-700 hover:bg-gray-50"
          >
            Go Back
          </button>
        )}
      </div>
    </div>
  );
};
