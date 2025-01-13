'use client';

import { PlusIcon, Search } from 'lucide-react';
import moment from 'moment-timezone';
import Link from 'next/link';
import { useCallback, useEffect, useRef, useState } from 'react';

import AlertTable from '@/components/alert-table';
import DashboardTitle from '@/components/dashboard-title';
import DateRangePicker, {
  DataRangePickerHandle,
} from '@/components/date-range-picker';
import Loading from '@/components/loading';
import { Button } from '@/components/ui/button';
import { getAlerts } from '@/lib/api';
import { useConfig } from '@/lib/config-context';
import { Alert, DateRange } from '@/lib/types';
import { cn } from '@/lib/utils';

export default function Page() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [firstLoad, setFirstLoad] = useState(false);
  const dateRangePickerRef = useRef<DataRangePickerHandle>(null);
  const { source } = useConfig();
  const [searchCount, setSearchCount] = useState(0);

  const fetchAlerts = useCallback(async () => {
    const range = dateRangePickerRef.current?.getDateRange();

    if (!range || !range.from || !range.to) {
      console.log('dateRange is not set');
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      const response = await getAlerts({
        dateFrom: range.from,
        dateTo: range.to,
        source: source,
      });
      const alerts = response.data.data['alerts'];
      setAlerts(alerts);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'An unknown error occurred',
      );
    } finally {
      setIsLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchCount]);

  useEffect(() => {
    if (!dateRange) {
      setDateRange({
        from: moment
          .tz('Asia/Hong_Kong')
          .subtract(1, 'day')
          .set({ hour: 5, minute: 0 })
          .toDate(),
        to: moment.tz('Asia/Hong_Kong').set({ hour: 4, minute: 59 }).toDate(),
      });
      setFirstLoad(true);
    }
  }, []);

  useEffect(() => {
    if (firstLoad) {
      fetchAlerts();
    }
  }, [firstLoad, fetchAlerts]);

  const onSearch = () => {
    if (dateRangePickerRef.current) {
      const dateRange = dateRangePickerRef.current.getDateRange();
      console.log(`search date range ${dateRange?.from} ~ ${dateRange?.to}`);
      setDateRange(dateRange);
      setSearchCount(searchCount + 1);
    }
  };

  return (
    <div className="flex h-screen flex-col space-y-6">
      <DashboardTitle>Alert Management</DashboardTitle>
      {/* date range section */}
      <div className="flex flex-row items-center justify-between gap-x-4">
        <div className="flex flex-row items-center gap-x-4">
          <DateRangePicker
            dateRange={dateRange}
            ref={dateRangePickerRef}
            type="single"
          />
          <Search
            className={cn('h-4 w-4 cursor-pointer')}
            // onClick={() => setDate(modifiedDate)}
            onClick={onSearch}
          />
        </div>
        <Link href="/dashboard/alert-management/email-management">
          <Button className="ml-auto bg-cyan-500 text-primary hover:bg-cyan-600">
            <PlusIcon />
            Email
          </Button>
        </Link>
      </div>
      {isLoading && <Loading />}
      {error && <div className="text-center text-red-500">{error}</div>}
      {!isLoading && !error && (
        <div>
          <AlertTable alerts={alerts} />
        </div>
      )}
    </div>
  );
}
