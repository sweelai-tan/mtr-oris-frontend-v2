'use client';

import { format } from 'date-fns';
import moment from 'moment-timezone';
import { CalendarIcon } from 'lucide-react';
import { forwardRef, useEffect, useImperativeHandle, useState } from 'react';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { DateRange } from '@/lib/types';

import { TimePicker } from './time-picker';
import { Calendar } from './ui/calendar';

interface DateRangePickerProps {
  dateRange: DateRange;
  type: 'single' | 'range';
}

export interface DataRangePickerHandle {
  getDateRange: () => DateRange | undefined;
}

const DateRangePicker = forwardRef<DataRangePickerHandle, DateRangePickerProps>(
  (props, ref) => {
    const [modifiedDateRange, setModifiedDateRange] = useState<
      DateRange | undefined
    >(undefined);

    useEffect(() => {
      if (modifiedDateRange) return;
      setModifiedDateRange(props.dateRange);
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const formatDateWithTime = (date: Date | undefined) => {
      if (!date) return '';
      return `${moment(date).format('yyyy/MM/DD hh:mm a')}`;
    };

    const setFromTime = (time: string) => {
      if (!modifiedDateRange?.from) return;
      const [hours, minutes] = time.split(/[: ]/);
      const isPM = time.includes('PM');
      const newFromDate = new Date(modifiedDateRange.from);
      newFromDate.setHours(isPM ? parseInt(hours) + 12 : parseInt(hours));
      newFromDate.setMinutes(parseInt(minutes));
      if (
        newFromDate.getHours() === modifiedDateRange.from?.getHours() &&
        newFromDate.getMinutes() === modifiedDateRange.from?.getMinutes()
      ) {
        return;
      }
      setModifiedDateRange({ from: newFromDate, to: modifiedDateRange.to });
    };

    const setToTime = (time: string) => {
      if (!modifiedDateRange?.to) return;
      const [hours, minutes] = time.split(/[: ]/);
      const isPM = time.includes('PM');
      const newToDate = new Date(modifiedDateRange.to);
      newToDate.setHours(isPM ? parseInt(hours) + 12 : parseInt(hours));
      newToDate.setMinutes(parseInt(minutes));
      if (
        newToDate.getHours() === modifiedDateRange.to?.getHours() &&
        newToDate.getMinutes() === modifiedDateRange.to?.getMinutes()
      ) {
        return;
      }
      setModifiedDateRange({ from: modifiedDateRange.from, to: newToDate });
    };

    const getDateRange = () => modifiedDateRange;

    useImperativeHandle(ref, () => ({
      getDateRange,
    }));

    return (
      <div className="w-[350px]">
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant={'outline'}
              className={cn(
                'w-full justify-start text-left font-normal',
                !modifiedDateRange && 'text-muted-foreground',
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {modifiedDateRange?.from ? (
                modifiedDateRange.to ? (
                  <>
                    {formatDateWithTime(modifiedDateRange.from)} ~{' '}
                    {formatDateWithTime(modifiedDateRange.to)}
                  </>
                ) : (
                  formatDateWithTime(modifiedDateRange.from)
                )
              ) : (
                <span>Pick a date range</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <div className="flex items-center justify-between border-b p-3">
              <span className="text-sm font-medium">
                {modifiedDateRange?.from
                  ? format(modifiedDateRange.from, 'MMMM yyyy')
                  : 'Select date range'}
              </span>
            </div>
            <div className="flex">
              {/* date picker section */}
              <div>
                <Calendar
                  initialFocus
                  mode="range"
                  min={2}
                  defaultMonth={modifiedDateRange?.from}
                  selected={modifiedDateRange}
                  onSelect={(range) => {
                    if (modifiedDateRange?.from === undefined && range?.from) {
                      range.from.setHours(5, 0, 0, 0);
                    }
                    if (modifiedDateRange?.from && range?.to) {
                      range.from?.setHours(
                        modifiedDateRange.from.getHours(),
                        modifiedDateRange.from.getMinutes(),
                        59,
                        999,
                      );
                      if (modifiedDateRange?.to === undefined) {
                        if (
                          modifiedDateRange.from.getDate() ===
                            range.to.getDate() &&
                          modifiedDateRange.from.getMonth() ===
                            range.to.getMonth() &&
                          modifiedDateRange.from.getFullYear() ===
                            range.to.getFullYear()
                        ) {
                          range.to.setHours(23, 59, 59, 999);
                        } else {
                          range.to.setHours(4, 59, 59, 999);
                        }
                      } else {
                        range.to.setHours(
                          modifiedDateRange.to.getHours(),
                          modifiedDateRange.to.getMinutes(),
                          59,
                          999,
                        );
                      }
                    }

                    setModifiedDateRange({ from: range?.from, to: range?.to });
                  }}
                  numberOfMonths={1}
                />
              </div>
              {/* time picker section */}
              <div className="border-l">
                <div className="flex h-full flex-col justify-start gap-4 p-1">
                  <div className="flex-grow">
                    <h3 className="mb-1 text-sm font-medium">From</h3>
                    <TimePicker
                      value={
                        modifiedDateRange?.from
                          ? format(modifiedDateRange.from, 'hh:mm a')
                          : '12:00 AM'
                      }
                      onChange={setFromTime}
                    />
                  </div>
                  <div className="flex-grow">
                    <h3 className="mb-1 text-sm font-medium">To</h3>
                    <TimePicker
                      value={
                        modifiedDateRange?.to
                          ? format(modifiedDateRange.to, 'hh:mm a')
                          : '12:00 AM'
                      }
                      onChange={setToTime}
                    />
                  </div>
                </div>
              </div>
            </div>
          </PopoverContent>
        </Popover>
      </div>
    );
  },
);

DateRangePicker.displayName = 'DateRangePicker';

export default DateRangePicker;
