'use client';

import { ArrowUpDown, Download, FileText, ChevronDown } from 'lucide-react';
import moment from 'moment-timezone';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';
import {
  DefectClass,
  DefectGroup,
  Event,
  EventStatus,
  getDefectClassLabel,
  getDefectGroupLabel,
  getEventDirectionLabel,
  getEventPositionLabel,
  statusTranslations,
} from '@/lib/types';
import { generateCsv, generatePdf } from '@/lib/api';

export interface EventTableProps {
  events: Event[];
}

export interface EventKey {
  direction: string;
  status: string;
  chainage: string;
  eventAt: string;
  group: string;
  class: string;
  position: string;
  remark: string;
}

export default function EventTable({ events }: EventTableProps) {
  const [selectedEvents, setSelectedEvents] = useState<string[]>([]);
  const [sortConfig, setSortConfig] = useState({
    key: 'status',
    direction: 'ascending',
  });
  const { toast } = useToast();

  const sortedEvents = [...events].sort((a, b) => {
    if (sortConfig.key === 'group' || sortConfig.key === 'class') {
      const defectA =
        a.defects && a.defects.length !== 0
          ? a.defects[0]
          : a.sysDefects && a.sysDefects.length > 0
            ? a.sysDefects[0]
            : null;
      const defectB =
        b.defects && b.defects.length !== 0
          ? b.defects[0]
          : b.sysDefects && b.sysDefects.length > 0
            ? b.sysDefects[0]
            : null;

      if (!defectA && defectB) {
        return sortConfig.direction === 'ascending' ? 1 : -1;
      } else if (defectA && !defectB) {
        return sortConfig.direction === 'ascending' ? -1 : 1;
      } else if (!defectA && !defectB) {
        return 0;
      }

      const key = sortConfig.key as keyof Event['defects'][0];
      if (defectA![key] < defectB![key]) {
        return sortConfig.direction === 'ascending' ? -1 : 1;
      }

      if (defectA![key] > defectB![key]) {
        return sortConfig.direction === 'ascending' ? 1 : -1;
      }

      return 0;
    }
    const key = sortConfig.key as keyof Event;
    if (a[key] < b[key]) {
      return sortConfig.direction === 'ascending' ? -1 : 1;
    }
    if (a[key] > b[key]) {
      return sortConfig.direction === 'ascending' ? 1 : -1;
    }
    return 0;
  });

  const requestSort = (key: keyof EventKey) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  const handleSelectAll = () => {
    if (selectedEvents.length === events.length) {
      setSelectedEvents([]);
    } else {
      setSelectedEvents(events.map((event) => event.id));
    }
  };

  const handleSelectEvent = (eventId: string) => {
    setSelectedEvents((prev) =>
      prev.includes(eventId)
        ? prev.filter((id) => id !== eventId)
        : [...prev, eventId],
    );
  };

  const getStatusColor = (status: Event['status']) => {
    switch (status) {
      case EventStatus.VERIFIED:
        return 'text-green-500';
      case EventStatus.PENDING:
        return 'text-pink-500';
      case EventStatus.MODIFIED:
        return 'text-yellow-500';
      default:
        return 'text-gray-500';
    }
  };

  const handleDownloadCSV = async () => {
    try {
      if (selectedEvents.length === 0) {
        toast({
          title: 'Export events',
          description: 'No events selected.',
          variant: 'destructive',
        });
        return;
      }

      toast({
        title: 'Export events',
        description: 'Exporting events as CSV...',
      });

      const exportEvents = events.filter((event) =>
        selectedEvents.includes(event.id),
      );
      // console.log(exportEvents);
      const response = await generateCsv(exportEvents);
      const contentDisposition = response.headers['content-disposition'];
      console.log(response.headers);
      let filename = 'report.csv';
      if (contentDisposition) {
        const match = contentDisposition.match(/filename="(.+)"/);
        if (match && match[1]) {
          filename = match[1];
        }
      }

      const fileBlob = new Blob([response.data], { type: 'text/csv' });
      const url = window.URL.createObjectURL(fileBlob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', filename);
      // Specify the file name
      document.body.appendChild(link);
      link.click();
      link.remove();

      toast({
        title: 'Export events',
        description: 'Events exported as CSV.',
      });
    } catch (error) {
      console.error('Failed to export CSV', error);
      toast({
        title: 'Export events',
        description: 'Failed to export CSV.',
        variant: 'destructive',
      });
    }
  };

  const handleDownloadPdf = async () => {
    try {
      if (selectedEvents.length === 0) {
        toast({
          title: 'Export events',
          description: 'No events selected.',
          variant: 'destructive',
        });
        return;
      }

      toast({
        title: 'Export events',
        description: 'Exporting events as PDF...',
      });

      const exportEvents = events.filter((event) =>
        selectedEvents.includes(event.id),
      );
      // console.log(exportEvents);
      const response = await generatePdf(exportEvents);

      const contentDisposition = response.headers['content-disposition'];
      console.log(response.headers);
      let filename = 'report.pdf';
      if (contentDisposition) {
        const match = contentDisposition.match(/filename="(.+)"/);
        if (match && match[1]) {
          filename = match[1];
        }
      }

      const fileBlob = new Blob([response.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(fileBlob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', filename);
      // Specify the file name
      document.body.appendChild(link);
      link.click();
      link.remove();

      toast({
        title: 'Export events',
        description: 'Events exported as PDF.',
      });
    } catch (error) {
      console.error('Failed to export PDF', error);
      toast({
        title: 'Export events',
        description: 'Failed to export PDF.',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="rounded-lg border border-gray-800 bg-[#1A2027]">
      <div className="flex items-center justify-between p-4">
        <h2 className="text-lg font-semibold text-white">Events</h2>
        <div className="flex items-center gap-2">
          {selectedEvents.length > 0 && (
            <span className="pr-4 text-sm text-gray-400">
              Selected: {selectedEvents.length} events
            </span>
          )}

          <Button
            variant="outline"
            size="sm"
            className="text-gray-400"
            onClick={handleDownloadCSV}
          >
            <Download className="mr-2 h-4 w-4" />
            Export as CSV
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="text-gray-400"
            onClick={handleDownloadPdf}
          >
            <FileText className="mr-2 h-4 w-4" />
            Export as report
          </Button>
        </div>
      </div>
      <div className="border-t border-gray-800 p-4">
        <span className="text-sm text-gray-400">{`${events.length} events`}</span>
      </div>

      <Table>
        <TableHeader>
          <TableRow className="border-gray-800 hover:bg-transparent">
            <TableHead className="w-12">
              <Checkbox
                checked={selectedEvents.length === events.length}
                onCheckedChange={handleSelectAll}
              />
            </TableHead>
            <TableHead
              className="text-gray-400"
              onClick={() => requestSort('eventAt')}
            >
              Date & Time
              <ChevronDown className="ml-1 inline-block h-4 w-4" />
            </TableHead>
            <TableHead className="text-gray-400">
              Car Name
              <ArrowUpDown className="ml-1 inline-block h-4 w-4" />
            </TableHead>
            <TableHead
              className="text-gray-400"
              onClick={() => requestSort('direction')}
            >
              Track
              <ChevronDown className="ml-1 inline-block h-4 w-4" />
            </TableHead>
            <TableHead
              className="text-gray-400"
              onClick={() => requestSort('chainage')}
            >
              Chainage
              <ChevronDown className="ml-1 inline-block h-4 w-4" />
            </TableHead>
            <TableHead
              className="text-gray-400"
              onClick={() => requestSort('position')}
            >
              Side
              <ChevronDown className="ml-1 inline-block h-4 w-4" />
            </TableHead>
            <TableHead className="text-gray-400">
              Class
              <ChevronDown
                className="ml-1 inline-block h-4 w-4"
                onClick={() => requestSort('class')}
              />
            </TableHead>
            <TableHead
              className="text-gray-400"
              onClick={() => requestSort('group')}
            >
              Type
              <ChevronDown className="ml-1 inline-block h-4 w-4" />
            </TableHead>
            <TableHead
              className="text-gray-400"
              onClick={() => requestSort('status')}
            >
              Status
              <ChevronDown className="ml-1 inline-block h-4 w-4" />
            </TableHead>
            <TableHead className="text-gray-400">
              Remarks{' '}
              <ChevronDown
                className="ml-1 inline-block h-4 w-4"
                onClick={() => requestSort('remark')}
              />
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedEvents.map((event) => (
            <TableRow
              key={event.id}
              className="border-gray-800 hover:bg-gray-800/50"
            >
              <TableCell>
                <Checkbox
                  checked={selectedEvents.includes(event.id)}
                  onCheckedChange={() => handleSelectEvent(event.id)}
                />
              </TableCell>
              <TableCell className="text-gray-300">
                {moment(event.eventAt)
                  .tz('Asia/Hong_KOng')
                  .format('YYYY/MM/DD HH:mm:ss')}
              </TableCell>
              <TableCell className="font-medium text-gray-300">
                {event.carName}
              </TableCell>
              <TableCell className="text-gray-300">
                {getEventDirectionLabel(event.direction)}
              </TableCell>
              <TableCell className="text-gray-300">{event.chainage}</TableCell>
              <TableCell className="text-gray-300">
                {getEventPositionLabel(event.position)}
              </TableCell>

              <TableCell className="text-gray-300">
                {getDefectGroupLabel(
                  event.defects.length !== 0
                    ? event.defects[0].group
                    : event.sysDefects.length !== 0
                      ? event.sysDefects[0].group
                      : DefectGroup.UNKNOWN,
                )}
              </TableCell>
              <TableCell className="text-gray-300">
                {getDefectClassLabel(
                  event.defects.length !== 0
                    ? event.defects[0].class
                    : event.sysDefects.length !== 0
                      ? event.sysDefects[0].class
                      : DefectClass.UNKNOWN,
                )}
              </TableCell>
              <TableCell>
                <span className={getStatusColor(event.status)}>
                  {statusTranslations[event.status]}
                </span>
              </TableCell>
              <TableCell className="flex items-center gap-2 text-gray-300">
                <span className="truncate">{event.remark}</span>
                {/* <Button variant="ghost" size="icon" className="h-8 w-8">
                  <Info className="h-4 w-4" />
                </Button> */}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
