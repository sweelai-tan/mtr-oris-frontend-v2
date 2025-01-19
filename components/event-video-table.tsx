/* eslint-disable import/named */
'use client';

import { useState } from 'react';
import moment from 'moment-timezone';
import { Trash2 } from 'lucide-react';
import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
  VisibilityState,
} from '@tanstack/react-table';

import { Inference, InferenceStatus } from '@/lib/types';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from './ui/table';
// import CustomPagination from './custom-pagination';
import { Button } from './ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from './ui/alert-dialog';

export interface EventVideoTableProps {
  inferences: Inference[];
  onItemDelete?: (id: string) => void;
}

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

export default function EventVideoTable({
  inferences,
  onItemDelete,
}: EventVideoTableProps) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});

  const columns: ColumnDef<Inference>[] = [
    {
      accessorKey: 'index',
      header: 'No.',
      cell: ({ row }) => {
        return <div className="text-left font-medium">{row.index + 1}</div>;
      },
    },
    {
      accessorKey: 'uploadedAt',
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            Uploaded At
          </Button>
        );
      },
      cell: ({ row }) => {
        return (
          <div className="text-left font-medium">
            {moment(row.original.uploadedAt)
              .tz('Asia/Hong_KOng')
              .format('DD/MM/YYYY HH:mm:ss')}
          </div>
        );
      },
      enableSorting: true,
    },
    {
      accessorKey: 'aiModelId',
      header: 'AI Model',
      cell: ({}) => {
        return <div className="text-left font-medium">TEST</div>;
      },
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => {
        return (
          <div className="text-left font-medium">
            <span className={getStatusColor(row.original.status)}>
              {row.original.status}
            </span>
          </div>
        );
      },
    },
    {
      accessorKey: 'comment',
      header: 'Remark',
      cell: ({ row }) => {
        return (
          <div className="text-left font-medium">{row.original.comment}</div>
        );
      },
    },
    {
      accessorKey: 'startAt',
      header: 'Started At',
      cell: ({ row }) => {
        return (
          <div className="text-left font-medium">
            {moment(row.original.startAt)
              .tz('Asia/Hong_KOng')
              .format('DD/MM/YYYY HH:mm:ss')}
          </div>
        );
      },
    },
    {
      accessorKey: 'endAt',
      header: 'Completed At',
      cell: ({ row }) => {
        return (
          <div className="text-left font-medium">
            {row.original.endAt
              ? moment(row.original.endAt)
                  .tz('Asia/Hong_KOng')
                  .format('DD/MM/YYYY HH:mm:ss')
              : ''}
          </div>
        );
      },
    },
    {
      accessorKey: 'totalEvents',
      header: 'Images',
      cell: ({ row }) => {
        return (
          <div className="text-left font-medium">
            {row.original.totalEvents}
          </div>
        );
      },
    },
    {
      id: 'actions',
      accessorKey: 'id',
      header: 'Actions',
      cell: ({ row }) => {
        return (
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="ghost"
                // onClick={() => console.log('Edit', row.original.id)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>
                  Are you sure want to delete?
                </AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete
                  your the inference job contents.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={async () => {
                    console.log('Delete', row.original.id);
                    if (onItemDelete) {
                      onItemDelete(row.original.id);
                    }
                  }}
                >
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        );
      },
    },
  ];

  const table = useReactTable({
    data: inferences,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel<Inference>(),
    getPaginationRowModel: getPaginationRowModel<Inference>(),
    getSortedRowModel: getSortedRowModel<Inference>(),
    getFilteredRowModel: getFilteredRowModel<Inference>(),
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  return (
    <div className="rounded-lg border border-gray-800 bg-slate-900">
      {/* <div className="flex items-center justify-between p-4">
        <h2 className="text-lg font-semibold text-white">Uploaded Videos</h2>
      </div> */}
      {/* <div>
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
      </Table> */}
      <div>
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && 'selected'}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="text-center">
                  No data available
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="flex-1 text-sm text-muted-foreground">
          {table.getFilteredSelectedRowModel().rows.length} of{' '}
          {table.getFilteredRowModel().rows.length} row(s) selected.
        </div>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
