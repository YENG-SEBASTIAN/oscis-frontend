'use client';

import { Skeleton } from '@/components/ui/skeleton';

export const ProductCardSkeleton = () => {
  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden h-full flex flex-col">
      <div className="relative overflow-hidden flex-1">
        <Skeleton className="w-full aspect-square" />
      </div>
      
      <div className="p-6 flex flex-col space-y-4">
        <Skeleton className="h-6 w-3/4" />
        <div className="flex space-x-1">
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} className="h-4 w-4 rounded-full" />
          ))}
        </div>
        <Skeleton className="h-4 w-1/2" />
        <div className="flex justify-between items-center">
          <Skeleton className="h-6 w-1/3" />
          <Skeleton className="h-4 w-1/4" />
        </div>
        <Skeleton className="h-10 w-full rounded-xl" />
      </div>
    </div>
  );
};