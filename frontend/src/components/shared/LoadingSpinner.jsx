import React from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

export const LoadingSpinner = ({ className, size = 'default', text }) => {
  const sizeClasses = {
    sm: 'h-4 w-4',
    default: 'h-8 w-8',
    lg: 'h-12 w-12',
    xl: 'h-16 w-16'
  };

  return (
    <div className={cn('flex flex-col items-center justify-center gap-3 w-full h-full min-h-[100px]', className)}>
      <Loader2 className={cn('animate-spin text-primary', sizeClasses[size] || sizeClasses.default)} />
      {text && <p className="text-sm font-medium animate-pulse text-muted-foreground">{text}</p>}
    </div>
  );
};

export default LoadingSpinner;
