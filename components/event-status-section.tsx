'use client';

import { useState } from 'react';

import { cn } from '@/lib/utils';

import { Badge } from './ui/badge';
import { Button } from './ui/button';

interface EventStatusSectionProps {
  onFilterChange?: (status: string) => void;
  defaultStatus?: string;
  allCount: number;
  pendingCount: number;
  verifiedCount: number;
  modifiedCount: number;
  className?: string;
}

export default function EventStatusSection({
  defaultStatus = 'ALL',
  onFilterChange,
  allCount = 0,
  pendingCount = 0,
  verifiedCount = 0,
  modifiedCount = 0,
  className,
}: EventStatusSectionProps) {
  const [activeFilter, setActiveFilter] = useState(defaultStatus);

  const filters = [
    { id: 'ALL', label: 'All', count: allCount },
    { id: 'PENDING', label: 'Pending', count: pendingCount },
    { id: 'VERIFIED', label: 'Verified', count: verifiedCount },
    { id: 'MODIFIED', label: 'Modified', count: modifiedCount },
  ];

  const handleFilterClick = (filterId: string) => {
    setActiveFilter(filterId);
    onFilterChange?.(filterId);
  };

  console.log(`activeFilter: ${activeFilter}`);

  return (
    <div className={cn('flex space-x-1 rounded-lg bg-black p-4', className)}>
      {filters.map((filter) => (
        <Button
          key={filter.id}
          onClick={() => handleFilterClick(filter.id)}
          disabled={filter.count === 0}
          className={cn(
            'relative flex min-w-[80px] items-center gap-x-2 rounded-md px-3 py-1.5 text-sm font-medium transition-colors',
            activeFilter === filter.id
              ? 'bg-cyan-500 text-gray-200 hover:bg-cyan-600'
              : 'bg-[#1A2027] text-gray-400 hover:bg-gray-800 hover:text-gray-300',
          )}
        >
          {filter.label}
          {filter.count !== undefined && (
            <Badge
              variant="destructive"
              className={cn(
                'ml-2 rounded-full',
                filter.count === 0 ? 'bg-slate-500' : 'bg-red-500 px-1.5',
                // filter.id === "ALL" ? "bg-slate-500" : "hover:bg-slate-700",
              )}
            >
              {filter.count}
            </Badge>
          )}
        </Button>
      ))}
    </div>
  );
}
