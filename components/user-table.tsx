/* eslint-disable import/named */
'use client';

import { useState } from 'react';
import {
  flexRender,
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
} from '@tanstack/react-table';
import type {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
} from '@tanstack/react-table';
import { ArrowDownAZ, ArrowUpAZ } from 'lucide-react';

import { User, UserStatus } from '@/lib/types';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from './ui/table';
import { Button } from './ui/button';
import Custom2Pagination from './custom2-pagination';

interface UserTableProps {
  users: User[];
}

const getStatusColor = (status: User['status']) => {
  switch (status) {
    case UserStatus.ACTIVE:
      return 'text-green-500';
    case UserStatus.INACTIVE:
      return 'text-yellow-500';
    default:
      return 'text-gray-500';
  }
};

export default function UserTable(params: UserTableProps) {
  const { users } = params;
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

  const columns: ColumnDef<User>[] = [
    {
      accessorKey: 'index',
      header: 'No.',
      cell: ({ row }) => {
        return <div className="text-left font-medium">{row.index + 1}</div>;
      },
      enableSorting: false,
    },
    {
      accessorKey: 'name',
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            Name
          </Button>
        );
      },
      cell: ({ row }) => {
        return <div className="text-left font-medium">{row.original.name}</div>;
      },
      enableSorting: true,
    },
    {
      accessorKey: 'email',
      header: 'Email',
      cell: ({ row }) => {
        return (
          <div className="text-left font-medium">{row.original.email}</div>
        );
      },
      enableSorting: false,
    },
    {
      accessorKey: 'role',
      header: 'Role',
      cell: ({ row }) => {
        return <div className="text-left font-medium">{row.original.role}</div>;
      },
      enableSorting: true,
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
      enableSorting: true,
    },
    {
      accessorKey: 'createdAt',
      header: 'Created At',
      cell: ({ row }) => {
        return (
          <div className="text-left font-medium">{row.original.createdAt}</div>
        );
      },
      enableSorting: true,
    },
  ];

  const table = useReactTable({
    data: users,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    // onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel<User>(),
    getPaginationRowModel: getPaginationRowModel<User>(),
    getSortedRowModel: getSortedRowModel<User>(),
    getFilteredRowModel: getFilteredRowModel<User>(),
    // onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      // columnVisibility,
      // rowSelection,
    },
    initialState: {
      pagination: {
        pageIndex: 0, //custom initial page index
        pageSize: 10, //custom default page size
      },
    },
  });

  const { pageSize, pageIndex } = table.getState().pagination;

  return (
    <div className="rounded-lg border border-gray-800 bg-slate-900">
      <div className="mb-4 mt-4 flex justify-end">
        <Custom2Pagination
          rowsPerPageOptions={[10, 20, 50]}
          count={table.getFilteredRowModel().rows?.length ?? 0}
          rowsPerPage={pageSize}
          page={pageIndex}
          onPageChange={(page) => table.setPageIndex(page)}
          onRowsPerPageChange={(pageSize) => table.setPageSize(pageSize)}
        />
      </div>
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead key={header.id} className="text-sm">
                    {header.isPlaceholder ? null : (
                      <div
                        className="flex flex-row items-center gap-x-2"
                        onClick={header.column.getToggleSortingHandler()}
                      >
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                        <span>
                          {header.column.getCanSort() ? (
                            header.column.getNextSortingOrder() === 'asc' ? (
                              <ArrowUpAZ className="h-4 w-4" />
                            ) : header.column.getNextSortingOrder() ===
                              'desc' ? (
                              <ArrowDownAZ className="h-4 w-4" />
                            ) : undefined
                          ) : undefined}
                        </span>
                      </div>
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
                  <TableCell key={cell.id} className="text-base">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell
                colSpan={columns.length}
                className="text-center text-lg"
              >
                No data available
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
