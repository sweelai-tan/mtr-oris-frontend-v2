'use client';

import { Search, SlidersHorizontalIcon } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';
import moment from 'moment-timezone';

import { cn } from '@/lib/utils';
import DateRangePicker, {
  DataRangePickerHandle,
} from '@/components/date-range-picker';
import DashboardTitle from '@/components/dashboard-title';
import { useConfig } from '@/lib/config-context';
import { getEvents } from '@/lib/api';
import { DateRange, Event } from '@/lib/types';
import EventTable from '@/components/event-table';

import {
  FilterSection,
  ChainageRange,
  FilterSectionHandle,
} from '../event-verification/filter-section';

/* eslint-disable @typescript-eslint/no-unused-vars */
export default function Page() {
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const [isFilteringVisible, setIsFilteringVisible] = useState(false);
  // const [eventDirections, setEventDirections] = useState<string[]>([]);
  // const [chainageRange, setChainageRange] = useState<ChainageRange>({
  //   from: undefined,
  //   to: undefined,
  // });
  // const [defectGroup, setDefectGroup] = useState<string | undefined>(undefined);
  // const [defectClasses, setDefectClasses] = useState<string[]>([]);
  // const [carName, setCarName] = useState<string | undefined>(undefined);
  // const [remark, setRemark] = useState<string | undefined>(undefined);
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [events, setEvents] = useState<Event[]>([]);
  const [originalEvents, setOriginalEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [total, setTotal] = useState(0);
  const [firstLoad, setFirstLoad] = useState(false);
  const dateRangePickerRef = useRef<DataRangePickerHandle>(null);
  const filterSectionRef = useRef<FilterSectionHandle>(null);
  const [carName, setCarName] = useState<string | undefined>(undefined);
  const [remark, setRemark] = useState<string | undefined>(undefined);
  const [defectGroup, setDefectGroup] = useState<string | undefined>(undefined);
  const [defectClasses, setDefectClasses] = useState<string[]>([]);
  const [chainageRange, setChainageRange] = useState<ChainageRange>({
    from: undefined,
    to: undefined,
  });
  const [eventDirections, setEventDirections] = useState<string[]>([]);
  const [searchCounter, setSearchCounter] = useState(0);

  const { source } = useConfig();

  const fetchEvents = useCallback(async () => {
    console.log(
      `Fetching events ${source} from ${dateRange?.from} to ${dateRange?.to}`,
    );
    if (!dateRange || !dateRange.from || !dateRange.to) {
      console.log('dateRange is not set');
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      const responseEvents = await getEvents({
        dateFrom: dateRange.from,
        dateTo: dateRange.to,
        source,
        eventDirections,
        chainageFrom: chainageRange.from,
        chainageTo: chainageRange.to,
        defectGroup,
        defectClasses,
        carName,
        remark,
        statusFilter: statusFilter === 'ALL' ? undefined : statusFilter,
        currentPage,
        itemsPerPage,
        sort: 'DESC',
      });

      const originalEvents: Event[] = responseEvents.data.data['events'];
      let events: Event[] = [];

      const total = responseEvents.data.data['total'];

      if (statusFilter === 'ALL') {
        events = [...originalEvents];
      } else {
        originalEvents.forEach((item) => {
          if (item.status === statusFilter) {
            events.push(item);
          }
        });
      }

      // console.log(response.data.data);
      setOriginalEvents(originalEvents);
      setEvents(events);
      setTotal(total);
    } catch (err) {
      console.error(err);
      setError(
        err instanceof Error ? err.message : 'An unknown error occurred',
      );
    } finally {
      setIsLoading(false);
    }
  }, [
    currentPage,
    itemsPerPage,
    source,
    dateRange,
    carName,
    eventDirections,
    chainageRange,
    defectGroup,
    defectClasses,
    remark,
    statusFilter,
    searchCounter,
  ]);

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
      fetchEvents();
    }
  }, [firstLoad, fetchEvents]);

  const onSearch = () => {
    if (dateRangePickerRef.current) {
      const dateRange = dateRangePickerRef.current.getDateRange();
      console.log(`search date range ${dateRange?.from} ~ ${dateRange?.to}`);
      setDateRange(dateRange);
      setSearchCounter(searchCounter + 1);
    }
  };

  const handleFilterApply = () => {
    if (filterSectionRef.current) {
      const chainageRange = filterSectionRef.current.getChainageRange();
      const carName = filterSectionRef.current.getCarName();
      const eventDirections = filterSectionRef.current.getEventDirections();
      const defectGroup = filterSectionRef.current.getDefectGroup();
      const defectClasses = filterSectionRef.current.getDefectClasses();
      const remark = filterSectionRef.current.getRemark();

      setChainageRange(chainageRange);
      setCarName(carName);
      setEventDirections(eventDirections);
      setDefectGroup(defectGroup);
      setDefectClasses(defectClasses);
      setRemark(remark);
    }
  };

  return (
    <div className="flex h-screen flex-col space-y-6">
      <DashboardTitle>Event Exporting</DashboardTitle>

      {/* date range section */}
      <div className="flex flex-row items-center gap-x-4">
        {dateRange && (
          <DateRangePicker
            dateRange={dateRange}
            type="single"
            ref={dateRangePickerRef}
          />
        )}
        <Search
          className={cn('h-4 w-4 cursor-pointer')}
          // onClick={() => setDate(modifiedDate)}
          onClick={() => onSearch()}
        />
        <SlidersHorizontalIcon
          className={cn(
            'h-4 w-4 cursor-pointer',
            isFilteringVisible ? 'bg-[#1B3A4B]' : 'text-zinc-400',
          )}
          onClick={() => setIsFilteringVisible(!isFilteringVisible)}
        />
      </div>

      {/* filter section */}
      {isFilteringVisible && (
        <FilterSection
          source={source}
          ref={filterSectionRef}
          // eventDirections={eventDirections}
          // setEventDirections={setEventDirections}
          // chainageRange={chainageRange}
          // setChainageRange={setChainageRange}
          // defectGroup={defectGroup}
          // setDefectGroup={setDefectGroup}
          // defectClasses={defectClasses}
          // setDefectClasses={setDefectClasses}
          // carName={carName}
          // setCarName={setCarName}
          // remark={remark}
          // setRemark={setRemark}
          fetchEvents={handleFilterApply}
          // clearFilters={clearFilters}
        />
      )}

      {/* Event table section*/}
      {isLoading ? (
        <div className="flex h-64 items-center justify-center">
          <div className="h-32 w-32 animate-spin rounded-full border-b-2 border-t-2 border-cyan-500"></div>
        </div>
      ) : error ? (
        <div className="text-center text-red-500">{error}</div>
      ) : (
        <div className="">
          <EventTable events={events} />
        </div>
        // <div className="flex flex-col">
        //   <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
        //     {events.map((event, index) => (
        //       <EventCard key={index} {...event} />
        //     ))}
        //   </div>
        //   <div>
        //     <CustomPagination
        //       totalItems={total}
        //       defaultItemsPerPage={itemsPerPage}
        //       onItemsPerPageChange={setItemsPerPage}
        //       onCurrentPageChange={setCurrentPage}
        //     />
        //   </div>
        // </div>
      )}
    </div>
  );
}
