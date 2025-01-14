'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import moment from 'moment-timezone';

import { Alert } from '@/lib/types';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from './ui/table';

export interface AlertTableProps {
  alerts: Alert[];
  startIndex: number;
}

export interface AlertKey {
  eventAt: string;
}

export default function AlertTable({ alerts, startIndex }: AlertTableProps) {
  const [sortConfig, setSortConfig] = useState({
    key: 'eventAt',
    direction: 'ascending',
  });

  const sortedAlerts = [...alerts].sort((a, b) => {
    const key = sortConfig.key as keyof Alert;
    if (a[key] < b[key]) {
      return sortConfig.direction === 'ascending' ? -1 : 1;
    }
    if (a[key] > b[key]) {
      return sortConfig.direction === 'ascending' ? 1 : -1;
    }
    return 0;
  });

  const requestSort = (key: keyof AlertKey) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  return (
    <div className="rounded-lg border border-gray-800 bg-[#1A2027]">
      <div className="flex items-center justify-between p-4">
        <h2 className="text-lg font-semibold text-white">Alerts</h2>
      </div>
      <Table>
        <TableHeader>
          <TableRow className="border-gray-800 hover:bg-transparent">
            <TableHead>
              <span className="text-gray-400">No.</span>
            </TableHead>
            <TableHead
              className="text-gray-400"
              onClick={() => requestSort('eventAt')}
            >
              Date & Time
              <ChevronDown className="ml-1 inline-block h-4 w-4" />
            </TableHead>
            <TableHead className="text-gray-400">Topic</TableHead>
            <TableHead className="text-gray-400">Sent</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedAlerts.map((alert, index) => (
            <TableRow
              key={alert.id}
              className="border-gray-800 hover:bg-gray-800/50"
            >
              <TableCell className="w-1/12 text-gray-300">
                {startIndex + index + 1}
              </TableCell>
              <TableCell className="w-2/12 text-gray-300">
                {moment(alert.eventAt)
                  .tz('Asia/Hong_KOng')
                  .format('DD/MM/YYYY HH:mm:ss')}
              </TableCell>
              <TableCell className="w-7/12 text-gray-300">
                {alert.topic}
              </TableCell>
              <TableCell className="w-2/12 text-gray-300">
                {alert.emails && alert.emails.length > 0 && alert.sent
                  ? 'Yes'
                  : 'No'}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <div className="border-t border-gray-800 p-4">
        <span className="text-sm text-gray-400">{`${sortedAlerts.length} events`}</span>
      </div>
    </div>
  );
}
