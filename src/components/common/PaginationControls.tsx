"use client";

import { Button } from "@/components/ui/button";

interface PaginationControlsProps {
  count: number;               // Total items (from DRF count)
  currentCount: number;        // Number of items currently displayed
  next: string | null;         // Next page URL
  previous: string | null;     // Previous page URL
  isLoading?: boolean;         // Optional loading state
  onNext: () => void;          // Handler for Next
  onPrev: () => void;          // Handler for Previous
  itemLabel?: string;          // Optional custom label ("categories", "products", etc.)
}

export default function PaginationControls({
  count,
  currentCount,
  next,
  previous,
  isLoading = false,
  onNext,
  onPrev,
  itemLabel = "items",
}: PaginationControlsProps) {
  if (count === 0) return null;

  return (
    <div className="mt-12 flex flex-col sm:flex-row items-center justify-between gap-4">
      <div className="text-sm text-gray-600">
        Showing {currentCount} of {count} {itemLabel}
      </div>
      <div className="flex gap-3">
        <Button
          variant="outline"
          onClick={onPrev}
          disabled={!previous || isLoading}
          className="min-w-[100px]"
        >
          Previous
        </Button>
        <Button
          variant="outline"
          onClick={onNext}
          disabled={!next || isLoading}
          className="min-w-[100px]"
        >
          Next
        </Button>
      </div>
    </div>
  );
}
