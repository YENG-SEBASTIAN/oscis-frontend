'use client';

import { cn } from '@/lib/utils';
import * as React from 'react';

const Skeleton = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      'animate-pulse rounded-md bg-gray-200 dark:bg-gray-800',
      className
    )}
    {...props}
  />
);

export { Skeleton };