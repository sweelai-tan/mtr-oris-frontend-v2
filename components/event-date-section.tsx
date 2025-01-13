import { CalendarIcon, Search, SlidersHorizontalIcon } from 'lucide-react';
import moment from 'moment-timezone';
import React from 'react';

import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { DateRange } from '@/lib/types';

interface EventDateSectionProps {
  date: DateRange | undefined;
  setDate: (date: DateRange | undefined) => void;
  isFilteringVisible: boolean;
  toggleFilteringVisibility: () => void;
  onSearch?: () => void;
}

const EventDateSection: React.FC<EventDateSectionProps> = ({
  date,
  setDate,
  isFilteringVisible,
  toggleFilteringVisibility,
}) => {
  const [modifiedDate, setModifiedDate] = React.useState<DateRange | undefined>(
    date,
  );

  return (
    <div className="flex flex-col gap-x-4 space-y-6">
      <div className="flex items-center gap-2">
        <Popover>
          <PopoverTrigger asChild>
            <Button
              id="date"
              variant="ghost"
              className={cn(
                'w-[300px] justify-start border border-zinc-800 text-left font-normal text-zinc-400 hover:bg-zinc-800/50 hover:text-zinc-100',
                !modifiedDate && 'text-muted-foreground',
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {modifiedDate?.from ? (
                modifiedDate.to ? (
                  <>
                    {moment(modifiedDate.from)
                      .tz('Asia/Hong_Kong')
                      .format('DD/MM/YYYY')}{' '}
                    -{' '}
                    {moment(modifiedDate.to)
                      .tz('Asia/Hong_Kong')
                      .format('DD/MM/YYYY')}
                  </>
                ) : (
                  moment(modifiedDate.from)
                    .tz('Asia/Hong_Kong')
                    .format('DD/MM/YYYY')
                )
              ) : (
                <span>Pick a date</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              initialFocus
              mode="range"
              defaultMonth={modifiedDate?.from}
              selected={modifiedDate}
              onSelect={setModifiedDate}
              numberOfMonths={2}
            />
          </PopoverContent>
        </Popover>
        <Search
          className={cn(
            'h-4 w-4 cursor-pointer',
            // isFilteringVisible ? "bg-[#1B3A4B]" : "text-zinc-400"
          )}
          onClick={() => setDate(modifiedDate)}
        />
        <SlidersHorizontalIcon
          className={cn(
            'h-4 w-4 cursor-pointer',
            isFilteringVisible ? 'bg-[#1B3A4B]' : 'text-zinc-400',
          )}
          onClick={toggleFilteringVisibility}
        />
      </div>
    </div>
  );
};

export default EventDateSection;
