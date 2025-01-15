'use client';

import { useState } from 'react';
import moment from 'moment-timezone';
import { ChevronDown } from 'lucide-react';

import { Inference, InferenceStatus } from '@/lib/types';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from './ui/table';
import CustomPagination from './custom-pagination';

export interface EventVideoTableProps {
  inferences: Inference[];
}

export default function EventVideoTable({ inferences }: EventVideoTableProps) {
  const [sortConfig, setSortConfig] = useState({
    key: 'eventAt',
    direction: 'ascending',
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const sortedInferences = [...inferences].sort((a, b) => {
    const key = sortConfig.key as keyof Inference;
    if (a[key] < b[key]) {
      return sortConfig.direction === 'ascending' ? -1 : 1;
    }
    if (a[key] > b[key]) {
      return sortConfig.direction === 'ascending' ? 1 : -1;
    }
    return 0;
  });

  const requestSort = (key: keyof Inference) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };
  const getStatusColor = (status: Inference['status']) => {
    switch (status) {
      case InferenceStatus.SUCCESS:
        return 'text-green-500';
      case InferenceStatus.PENDING:
        return 'text-blue-500';
      case InferenceStatus.IN_PROGRESS:
        return 'text-yellow-500';
      case InferenceStatus.FAILED:
        return 'text-red-500';
      default:
        return 'text-gray-500';
    }
  };

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;

  const currentInferences = sortedInferences.slice(startIndex, endIndex);

  return (
    <div className="rounded-lg border border-gray-800 bg-slate-900">
      {/* <div className="flex items-center justify-between p-4">
        <h2 className="text-lg font-semibold text-white">Uploaded Videos</h2>
      </div> */}
      <div>
        <CustomPagination
          currentPage={currentPage}
          itemsPerPage={itemsPerPage}
          totalItems={inferences.length}
          onItemsPerPageChange={(itemsPerPage) => setItemsPerPage(itemsPerPage)}
          onCurrentPageChange={(page) => setCurrentPage(page)}
        />
      </div>
      <Table>
        <TableHeader>
          <TableRow className="border-gray-800 hover:bg-transparent">
            <TableHead>
              <span className="text-gray-400">No.</span>
            </TableHead>
            <TableHead
              className="text-gray-400"
              onClick={() => requestSort('uploadedAt')}
            >
              Created At
              <ChevronDown className="ml-1 inline-block h-4 w-4" />
            </TableHead>
            <TableHead className="text-gray-400">AI Model</TableHead>
            <TableHead className="text-gray-400">Status</TableHead>
            <TableHead className="text-gray-400">Remark</TableHead>
            <TableHead className="text-gray-400">Completed At</TableHead>
            <TableHead className="text-gray-400">Images</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {currentInferences.map((inference, index) => (
            <TableRow
              key={inference.id}
              className="border-gray-800 hover:bg-gray-800/50"
            >
              <TableCell className="w-1/12 text-gray-300">
                {startIndex + index}
              </TableCell>
              <TableCell className="w-2/12 text-gray-300">
                {moment(inference.uploadedAt)
                  .tz('Asia/Hong_KOng')
                  .format('DD/MM/YYYY HH:mm:ss')}
              </TableCell>
              <TableCell className="w-2/12 text-gray-300">TEST</TableCell>
              <TableCell className="w-1/12 text-gray-300">
                <span className={getStatusColor(inference.status)}>
                  {inference.status}
                </span>
              </TableCell>
              <TableCell className="w-3/12 text-gray-300">
                {inference.comment}
              </TableCell>
              <TableCell className="w-2/12 text-gray-300">
                {inference.endAt
                  ? moment(inference.endAt)
                      .tz('Asia/Hong_KOng')
                      .format('DD/MM/YYYY HH:mm:ss')
                  : ''}
              </TableCell>
              <TableCell className="w-1/12 text-gray-300">
                {inference.totalEvents}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
