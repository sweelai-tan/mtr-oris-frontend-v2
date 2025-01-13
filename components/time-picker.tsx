'use client';

import { useEffect, useRef, useState } from 'react';

import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';

interface TimePickerProps {
  value: string;
  onChange: (value: string) => void;
}

export function TimePicker({ value, onChange }: TimePickerProps) {
  const [selectedHour, setSelectedHour] = useState(() => {
    const [time] = value.split(' ');
    const [hour] = time.split(':');
    return hour;
  });
  const [selectedMinute, setSelectedMinute] = useState(() => {
    const [time] = value.split(' ');
    const [, minute] = time.split(':');
    return minute;
  });
  const [selectedPeriod, setSelectedPeriod] = useState(() => {
    const [, period] = value.split(' ');
    return period;
  });
  const selectedHourRef = useRef<HTMLDivElement | null>(null);
  const seletectedMinuteRef = useRef<HTMLDivElement | null>(null);
  const selectedPeriodRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const timeString = `${selectedHour}:${selectedMinute} ${selectedPeriod}`;
    onChange(timeString);
  }, [selectedHour, selectedMinute, selectedPeriod, onChange]);

  useEffect(() => {
    if (selectedHourRef.current) {
      selectedHourRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      });
    }
  }, [selectedHour]);

  useEffect(() => {
    if (seletectedMinuteRef.current) {
      seletectedMinuteRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      });
    }
  }, [selectedMinute]);

  useEffect(() => {
    if (selectedPeriodRef.current) {
      selectedPeriodRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      });
    }
  }, [selectedPeriod]);

  const hours = Array.from({ length: 12 }, (_, i) =>
    String(i + 1).padStart(2, '0'),
  );
  const minutes = Array.from({ length: 60 }, (_, i) =>
    String(i).padStart(2, '0'),
  );
  const periods = ['AM', 'PM'];

  return (
    <div className="flex h-full w-full flex-col">
      {/* header section */}
      <div className="grid grid-cols-3 gap-1 px-1 py-1">
        <div className="text-sm font-medium">Hours</div>
        <div className="text-sm font-medium">Minutes</div>
        <div className="text-sm font-medium">AM/PM</div>
      </div>
      {/* body section */}
      <div className="grid grid-cols-3 gap-1">
        <ScrollArea className="h-[100px]">
          {hours.map((hour) => (
            <div
              key={hour}
              ref={hour === selectedHour ? selectedHourRef : null}
              onClick={() => setSelectedHour(hour)}
              className={cn(
                'mx-2 my-2 cursor-pointer text-center text-sm hover:bg-muted/50',
                selectedHour === hour &&
                  'rounded-md bg-primary text-primary-foreground',
              )}
            >
              {hour}
            </div>
          ))}
        </ScrollArea>
        <ScrollArea className="h-[100px]">
          {minutes.map((minute) => (
            <div
              key={minute}
              ref={minute === selectedMinute ? seletectedMinuteRef : null}
              onClick={() => setSelectedMinute(minute)}
              className={cn(
                'mx-2 my-2 cursor-pointer text-center text-sm hover:bg-muted/50',
                selectedMinute === minute &&
                  'rounded-md bg-primary text-primary-foreground',
              )}
            >
              {minute}
            </div>
          ))}
        </ScrollArea>
        <ScrollArea className="h-[100px]">
          {periods.map((period) => (
            <div
              key={period}
              ref={period === selectedPeriod ? selectedPeriodRef : null}
              onClick={() => setSelectedPeriod(period)}
              className={cn(
                'mx-2 my-2 cursor-pointer text-center text-sm hover:bg-muted/50',
                selectedPeriod === period &&
                  'rounded-md bg-primary text-primary-foreground',
              )}
            >
              {period}
            </div>
          ))}
        </ScrollArea>
      </div>
    </div>
  );
}
