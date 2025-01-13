'use client';

import { Search, SlidersHorizontalIcon, X } from 'lucide-react';
import moment from 'moment-timezone';
import { useCallback, useEffect, useRef, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

import { cn } from '@/lib/utils';
import DateRangePicker, {
  DataRangePickerHandle,
} from '@/components/date-range-picker';
import DashboardTitle from '@/components/dashboard-title';
import { DateRange, Event } from '@/lib/types';
import EventStatusSection from '@/components/event-status-section';
import CustomPagination from '@/components/custom-pagination';
import { useConfig } from '@/lib/config-context';
import { getEvents, getStatusCount } from '@/lib/api';
import EventCard from '@/components/event-card';
import { Button } from '@/components/ui/button';
import EventEditForm from '@/components/event-edit-form';
import Loading from '@/components/loading';
import Error from '@/components/error';

import {
  FilterSection,
  ChainageRange,
  FilterSectionHandle,
} from './filter-section';

interface StatusCount {
  all: number;
  pending: number;
  verified: number;
  modified: number;
}

function EventVerificationPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scrollPosition, setScrollPosition] = useState(0);
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);
  const [isFilteringVisible, setIsFilteringVisible] = useState(false);
  const [statusCount, setStatusCount] = useState<StatusCount>({
    all: 0,
    pending: 0,
    verified: 0,
    modified: 0,
  });
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [events, setEvents] = useState<Event[]>([]);
  // const [originalEvents, setOriginalEvents] = useState<Event[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [total, setTotal] = useState(0);
  const { source } = useConfig();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const searchParams = useSearchParams();
  const router = useRouter();
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
  const [sort, setSort] = useState<'ASC' | 'DESC'>('DESC');
  const [searchCounter, setSearchCounter] = useState(0);

  const fetchEvents = useCallback(async () => {
    console.log(
      `Fetching events ${source} from ${dateRange?.from} to ${dateRange?.to}`,
    );
    if (!dateRange || !dateRange.from || !dateRange.to) {
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      console.log('fetching events');

      // console.log(`carName ${carName}`);
      // console.log(`direction ${eventDirections}`);
      // console.log(`chainageRange ${chainageRange.from} ~ ${chainageRange.to}`);

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
        sort,
      });

      const responseStatusCount = await getStatusCount({
        source,
        dateFrom: dateRange.from,
        dateTo: dateRange.to,
        carName: carName,
        directions: eventDirections,
        chainageFrom: chainageRange.from,
        chainageTo: chainageRange.to,
        defectGroup: defectGroup,
        defectClasses: defectClasses,
      });

      // const originalEvents: Event[] = responseEvents.data.data['events'];
      // let events: Event[] = [];

      // const total = responseEvents.data.data['total'];

      // if (statusFilter === 'ALL') {
      //   events = [...originalEvents];
      // } else {
      //   originalEvents.forEach((item) => {
      //     if (item.status === statusFilter) {
      //       events.push(item);
      //     }
      //   });
      // }

      // console.log(response.data.data);
      // setOriginalEvents(originalEvents);
      const total =
        responseStatusCount.data.data['statusAggregate']['PENDING'] +
        responseStatusCount.data.data['statusAggregate']['VERIFIED'] +
        responseStatusCount.data.data['statusAggregate']['MODIFIED'];
      const events = responseEvents.data.data['events'];
      setEvents(events);
      setTotal(total);

      setStatusCount({
        all: total,
        pending: responseStatusCount.data.data['statusAggregate']['PENDING'],
        verified: responseStatusCount.data.data['statusAggregate']['VERIFIED'],
        modified: responseStatusCount.data.data['statusAggregate']['MODIFIED'],
      });

      const setScroll = () => {
        if (containerRef.current) {
          containerRef.current.scrollTop = scrollPosition;
        }
      };
      setScroll();
    } catch (err) {
      console.error(err);
      setError(
        (err as any) instanceof Error
          ? (err as Error).message
          : 'An unknown error occurred',
      );
    } finally {
      setIsLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    currentPage,
    itemsPerPage,
    source,
    dateRange,
    filterSectionRef,
    carName,
    eventDirections,
    chainageRange,
    defectGroup,
    defectClasses,
    remark,
    statusFilter,
    searchCounter,
    sort,
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

  const handleFilterApply = () => {
    if (filterSectionRef.current) {
      const chainageRange = filterSectionRef.current.getChainageRange();
      const carName = filterSectionRef.current.getCarName();
      const eventDirections = filterSectionRef.current.getEventDirections();
      const defectGroup = filterSectionRef.current.getDefectGroup();
      const defectClasses = filterSectionRef.current.getDefectClasses();
      const remark = filterSectionRef.current.getRemark();
      const sort = filterSectionRef.current.getSort();

      setChainageRange(chainageRange);
      setCarName(carName);
      setEventDirections(eventDirections);
      setDefectGroup(defectGroup);
      setDefectClasses(defectClasses);
      setRemark(remark);
      setSort(sort);
    }
  };

  const handleScroll = () => {
    if (containerRef.current) {
      setScrollPosition(containerRef.current.scrollTop);
    }
  };

  const onSearch = () => {
    if (dateRangePickerRef.current) {
      const dateRange = dateRangePickerRef.current.getDateRange();
      console.log(`search date range ${dateRange?.from} ~ ${dateRange?.to}`);
      setDateRange(dateRange);
      setSearchCounter(searchCounter + 1);
    }
  };

  const updateEventById = (updatedEvent: Event) => {
    if (updatedEvent) {
      const updatedEvents = events.map((event) => {
        if (event.id === updatedEvent.id) {
          return updatedEvent;
        }
        return event;
      });
      setEvents(updatedEvents);
    }
  };

  // check if the page is in edit mode
  const id = searchParams.get('id');
  if (id) {
    const selectedEvent = events.find((event) => event.id === id);
    const previousEventId = selectedEvent
      ? events[events.indexOf(selectedEvent) - 1]?.id
      : null;
    const nextEventId = selectedEvent
      ? events[events.indexOf(selectedEvent) + 1]?.id
      : null;

    return (
      <div className="flex h-screen flex-col space-y-6">
        <div className="flex flex-row justify-between">
          <DashboardTitle>Edit Event</DashboardTitle>
          {/* add back button */}
          <Button variant="ghost" size="icon" onClick={() => router.back()}>
            <X className="h-4 w-4" />
          </Button>
        </div>
        <div>
          {selectedEvent ? (
            <EventEditForm
              className="w-max-lg"
              event={selectedEvent}
              previousEventId={previousEventId}
              nextEventId={nextEventId}
              onEventUpdated={updateEventById}
            />
          ) : (
            <div className="text-center text-red-500">Event not found</div>
          )}
        </div>
      </div>
    );
  }

  console.log(`page: dateRange ${dateRange?.from} ~ ${dateRange?.to}`);

  return (
    <div
      className="flex h-screen flex-col space-y-6"
      ref={containerRef}
      onScroll={handleScroll}
    >
      <DashboardTitle>Event Verification</DashboardTitle>
      <div className="flex flex-row items-center gap-x-4">
        {dateRange && (
          <DateRangePicker
            dateRange={dateRange}
            type="range"
            ref={dateRangePickerRef}
          />
        )}
        <Button
          className="bg-transparent transition duration-200 hover:bg-slate-900"
          onClick={() => onSearch()}
        >
          <Search className="h-4 w-4 cursor-pointer text-primary" />
        </Button>
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

      {/* status section */}
      <div className="flex flex-row items-center gap-x-4">
        <EventStatusSection
          defaultStatus={statusFilter}
          allCount={statusCount.all}
          pendingCount={statusCount.pending}
          verifiedCount={statusCount.verified}
          modifiedCount={statusCount.modified}
          onFilterChange={setStatusFilter}
        />
        <SlidersHorizontalIcon
          className={cn(
            'h-4 w-4 cursor-pointer',
            isFilteringVisible ? 'bg-[#1B3A4B]' : 'text-zinc-400',
          )}
          onClick={() => setIsFilteringVisible(!isFilteringVisible)}
        />
      </div>

      {isLoading ? <Loading /> : null}
      {error ? <Error message={error} /> : null}

      {!isLoading && !error && (
        <>
          {/* top pagination */}
          {events && events.length > 0 && (
            <CustomPagination
              currentPage={currentPage}
              itemsPerPage={itemsPerPage}
              totalItems={total}
              defaultItemsPerPage={itemsPerPage}
              onItemsPerPageChange={setItemsPerPage}
              onCurrentPageChange={setCurrentPage}
            />
          )}

          {/* card list */}
          {events && events.length > 0 && (
            <div className="grid grid-cols-1 gap-2 md:grid-cols-2 lg:grid-cols-2">
              {events.map((event, index) => {
                return <EventCard key={index} {...event} />;
              })}
            </div>
          )}

          {/* bottom pagination */}
          {events && events.length > 0 && (
            <CustomPagination
              currentPage={currentPage}
              itemsPerPage={itemsPerPage}
              totalItems={total}
              defaultItemsPerPage={itemsPerPage}
              onItemsPerPageChange={setItemsPerPage}
              onCurrentPageChange={setCurrentPage}
            />
          )}
        </>
      )}
    </div>
  );
}

export default function Page() {
  return (
    <>
      <Suspense fallback={<Loading />}>
        <EventVerificationPage />
      </Suspense>
    </>
  )
}
