'use client';

import {
  ArrowDownAZ,
  ArrowUpAZ,
  Search,
  SlidersHorizontalIcon,
} from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';

import { cn } from '@/lib/utils';
import DateRangePicker, {
  DataRangePickerHandle,
} from '@/components/date-range-picker';
import DashboardTitle from '@/components/dashboard-title';
import { useConfig } from '@/lib/config-context';
import { getEvents } from '@/lib/api';
import { Event } from '@/lib/types';
import EventTable from '@/components/event-table';
import { Button } from '@/components/ui/button';

import {
  FilterSection,
  ChainageRange,
  FilterData,
} from '../event-verification/filter-section';

export default function Page() {
  // const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const [isFilteringVisible, setIsFilteringVisible] = useState(false);
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [firstLoad, setFirstLoad] = useState(false);
  const dateRangePickerRef = useRef<DataRangePickerHandle>(null);
  const [carName, setCarName] = useState<string | undefined>(undefined);
  const [remark, setRemark] = useState<string | undefined>(undefined);
  const [defectGroup, setDefectGroup] = useState<string | undefined>(undefined);
  const [defectClasses, setDefectClasses] = useState<string[]>([]);
  const [chainageRange, setChainageRange] = useState<ChainageRange>({
    from: undefined,
    to: undefined,
  });
  const [eventDirections, setEventDirections] = useState<string[]>([]);
  const [searchCount, setSearchCount] = useState(0);
  const [sort, setSort] = useState<'ASC' | 'DESC'>('DESC');
  const { source, dateRange, updateConfig } = useConfig();
  const [filterData, setFilterData] = useState<FilterData>({
    carName: undefined,
    chainageRange: { from: undefined, to: undefined },
    eventDirections: [],
    defectGroup: undefined,
    defectClasses: [],
    remark: undefined,
  });

  console.log('filterData', filterData);

  const fetchEvents = useCallback(async () => {
    console.log(
      `Fetching events ${source} from ${dateRange?.from} to ${dateRange?.to} (${searchCount})`,
    );
    if (!dateRange || !dateRange.from || !dateRange.to) {
      console.log('dateRange is not set');
      return;
    }

    if (!source) {
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
        sort,
      });

      // const total = responseEvents.length;

      // console.log(response.data.data);
      setEvents(responseEvents);
    } catch (err) {
      console.error(err);
      setError(
        err instanceof Error ? err.message : 'An unknown error occurred',
      );
    } finally {
      setIsLoading(false);
    }
  }, [
    source,
    dateRange,
    carName,
    eventDirections,
    chainageRange,
    defectGroup,
    defectClasses,
    remark,
    searchCount,
    sort,
  ]);

  useEffect(() => {
    if (dateRange) {
      setFirstLoad(true);
    }
  }, [dateRange]);

  useEffect(() => {
    if (firstLoad) {
      fetchEvents();
    }
  }, [firstLoad, fetchEvents]);

  const onSearch = () => {
    if (dateRangePickerRef.current) {
      const dateRange = dateRangePickerRef.current.getDateRange();
      console.log(`search date range ${dateRange?.from} ~ ${dateRange?.to}`);
      updateConfig({ dateRange: dateRange });
      setSearchCount(searchCount + 1);
    }
  };

  const handleFilterApply = () => {
    setChainageRange(filterData.chainageRange);
    setCarName(filterData.carName);
    setEventDirections(filterData.eventDirections);
    setDefectGroup(filterData.defectGroup);
    setDefectClasses(filterData.defectClasses);
    setRemark(filterData.remark);
    setSearchCount(searchCount + 1);
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
        {/* <div>
          <RadioGroup value={sort} onValueChange={(v) => setSort(v as Sort)}>
            <div className="flex flex-row items-center space-x-4 pt-2">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="DESC" id="r2" />
                <Label htmlFor="r2">DESC</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="ASC" id="r3" />
                <Label htmlFor="r3">ASC</Label>
              </div>
            </div>
          </RadioGroup>
        </div> */}
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
          // ref={filterSectionRef}
          fetchEvents={handleFilterApply}
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
