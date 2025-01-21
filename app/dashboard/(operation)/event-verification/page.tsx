'use client';

import {
  ArrowDownAZ,
  ArrowUpAZ,
  Search,
  SlidersHorizontalIcon,
  X,
} from 'lucide-react';
import { useCallback, useEffect, useRef, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

import { cn } from '@/lib/utils';
import DateRangePicker, {
  DataRangePickerHandle,
} from '@/components/date-range-picker';
import DashboardTitle from '@/components/dashboard-title';
import { Event } from '@/lib/types';
import EventStatusSection from '@/components/event-status-section';
import CustomPagination from '@/components/custom-pagination';
import { useConfig } from '@/lib/config-context';
import {
  createEvent,
  CreateEventData,
  getEvents,
  getStatusCount,
} from '@/lib/api';
import EventCard from '@/components/event-card';
import { Button } from '@/components/ui/button';
import EventEditForm from '@/components/event-edit-form';
import Loading from '@/components/loading';
import Error from '@/components/error';
import { toast } from '@/hooks/use-toast';

import {
  FilterSection,
  ChainageRange,
  FilterSectionHandle,
  FilterData,
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
  const [isFilteringVisible, setIsFilteringVisible] = useState(false);
  const [statusCount, setStatusCount] = useState<StatusCount>({
    all: 0,
    pending: 0,
    verified: 0,
    modified: 0,
  });
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [events, setEvents] = useState<Event[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [total, setTotal] = useState(0);
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
  const [gridColumns, setGridColumns] = useState(2);
  const { source, dateRange, updateConfig } = useConfig();
  const [filterData, setFilterData] = useState<FilterData>({
    carName: undefined,
    chainageRange: { from: undefined, to: undefined },
    eventDirections: [],
    defectGroup: undefined,
    defectClasses: [],
    remark: undefined,
  });

  const fetchEvents = useCallback(async () => {
    console.log(
      `Fetching events ${source} from ${dateRange?.from} to ${dateRange?.to}`,
    );
    if (!dateRange || !dateRange.from || !dateRange.to) {
      return;
    }

    if (!source) {
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
        remark,
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
      const totalPending = responseStatusCount.pending;
      const totalVerified = responseStatusCount.verified;
      const totalModified = responseStatusCount.modified;
      const total = responseStatusCount.total;

      const events = responseEvents;
      setEvents(events);

      const hasFilter =
        !carName ||
        eventDirections.length > 0 ||
        !chainageRange.from ||
        !chainageRange.to ||
        !defectGroup ||
        defectClasses.length > 0 ||
        !remark;

      if (hasFilter) {
        setTotal(
          statusFilter === 'PENDING'
            ? responseStatusCount.filteredPending
            : statusFilter === 'VERIFIED'
              ? responseStatusCount.filteredVerified
              : statusFilter === 'MODIFIED'
                ? responseStatusCount.filteredModified
                : responseStatusCount.filteredTotal,
        );
      } else {
        setTotal(
          statusFilter === 'PENDING'
            ? responseStatusCount.pending
            : statusFilter === 'VERIFIED'
              ? responseStatusCount.verified
              : statusFilter === 'MODIFIED'
                ? responseStatusCount.modified
                : total,
        );
      }

      setStatusCount({
        all: total,
        pending: totalPending,
        verified: totalVerified,
        modified: totalModified,
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
        (err as unknown) instanceof Error
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
    sort,
    searchCounter,
  ]);

  useEffect(() => {
    if (dateRange) {
      // setDateRange({
      //   from: moment
      //     .tz('Asia/Hong_Kong')
      //     .subtract(1, 'day')
      //     .set({ hour: 5, minute: 0 })
      //     .toDate(),
      //   to: moment.tz('Asia/Hong_Kong').set({ hour: 4, minute: 59 }).toDate(),
      // });
      setFirstLoad(true);
    }
  }, [dateRange]);

  useEffect(() => {
    if (firstLoad) {
      fetchEvents();
    }
  }, [firstLoad, fetchEvents]);

  useEffect(() => {
    const handleResize = () => {
      const zoomLevel = window.devicePixelRatio * 100;

      // console.log(`zoomLevel`, zoomLevel);
      // console.log(`window.innerWidth`, window.innerWidth);
      // console.log(`window.innerHeight`, window.innerHeight);
      // setGridColumnsBaseOnInnerWidth(window.innerWidth);
      setGridColumnsBaseOnZooomLevel(zoomLevel);
    };
    window.addEventListener('resize', handleResize);

    handleResize();

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const setGridColumnsBaseOnZooomLevel = (zoomLevel: number) => {
    console.log(`setGridColumnsBaseOnZooomLevel`, zoomLevel);
    if (zoomLevel <= 50) {
      setGridColumns(5);
    } else if (zoomLevel <= 75) {
      setGridColumns(3);
    } else if (zoomLevel <= 100) {
      setGridColumns(2);
    } else if (zoomLevel < 150) {
      setGridColumns(2);
    } else {
      setGridColumns(1);
    }
  };

  // const setGridColumnsBaseOnInnerWidth = (width: number) => {
  //   if (width <= 960) {
  //     setGridColumns(1);
  //   } else if (width > 960 && width <= 1280) {
  //     setGridColumns(2);
  //   } else if (width > 1280 && width <= 1600) {
  //     setGridColumns(3);
  //   } else if (width > 1600 && width <= 1920) {
  //     setGridColumns(4);
  //   } else {
  //     setGridColumns(5);
  //   }
  // };

  const handleFilterApply = () => {
    setChainageRange(filterData.chainageRange);
    setCarName(filterData.carName);
    setEventDirections(filterData.eventDirections);
    setDefectGroup(filterData.defectGroup);
    setDefectClasses(filterData.defectClasses);
    setRemark(filterData.remark);
    setSearchCounter(searchCounter + 1);
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
      updateConfig({ dateRange: dateRange });
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

  const handleDuplicateEvent = async (event: Event) => {
    const newEvent: CreateEventData = {
      ...event,
      sysDefects: event.sysDefects
        ? JSON.parse(JSON.stringify(event.sysDefects))
        : [],
      defects: event.defects ? JSON.parse(JSON.stringify(event.defects)) : [],
      parentId: event.parentId ? event.parentId : event.id,
    };

    try {
      const result = await createEvent(newEvent.source, newEvent);
      if (result) {
        toast({
          title: 'Duplicate event',
          description: 'Event duplicated successfully.',
        });
      }
      setSearchCounter(searchCounter + 1);
    } catch (error) {
      console.error('Error duplicating event:', error);
      toast({
        title: 'Duplicate event',
        description: 'Event duplicated failed.',
        variant: 'destructive',
      });
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
          {selectedEvent ? (
            <Button variant="ghost" size="icon" onClick={() => router.back()}>
              <X className="h-4 w-4" />
            </Button>
          ) : (
            ''
          )}
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
            <div className="flex flex-col items-center justify-center space-y-4">
              <div className="text-center text-red-500">Event not found</div>
              <Button
                variant="secondary"
                // size="icon"
                onClick={() => router.push('/dashboard/event-verification')}
                className="bg-cyan-500 hover:bg-cyan-600"
              >
                Back
              </Button>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div
      className="flex h-screen flex-col space-y-6"
      ref={containerRef}
      onScroll={handleScroll}
    >
      <DashboardTitle>Event Verification</DashboardTitle>
      <div className="flex flex-row items-center gap-x-2">
        {dateRange && dateRange.from && dateRange.to && (
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
        {/* Sort */}
        {sort === 'ASC' ? (
          <Button
            className="bg-transparent transition duration-200 hover:bg-slate-900"
            onClick={() => setSort('DESC')}
          >
            <ArrowDownAZ className="h-4 w-4 cursor-pointer text-primary" />
          </Button>
        ) : (
          <Button
            className="bg-transparent transition duration-200 hover:bg-slate-900"
            onClick={() => setSort('ASC')}
          >
            <ArrowUpAZ className="h-4 w-4 cursor-pointer text-primary" />
          </Button>
        )}
      </div>

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

      {/* filter section */}
      {isFilteringVisible && source && (
        <FilterSection
          source={source}
          data={filterData}
          setData={setFilterData}
          fetchEvents={handleFilterApply}
        />
      )}

      {isLoading ? <Loading /> : null}
      {error ? <Error>{error}</Error> : null}

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
            <div className={`grid grid-cols-${gridColumns} gap-2`}>
              {events.map((event, index) => {
                return (
                  <EventCard
                    key={index}
                    event={event}
                    onEventDuplicate={handleDuplicateEvent}
                  />
                );
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
  );
}
