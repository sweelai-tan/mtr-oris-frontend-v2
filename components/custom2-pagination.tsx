import { cn } from '@/lib/utils';

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from './ui/pagination';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';

interface Custom2PaginationProps {
  count: number;
  rowsPerPage: number;
  page: number;
  rowsPerPageOptions?: ReadonlyArray<number | { value: number; label: string }>;
  onPageChange: (page: number) => void;
  onRowsPerPageChange?: (rowsPerPage: number) => void;
}

const getPageNumbers = (totalPages: number, currentPage: number) => {
  const pageNumbers = [];
  if (totalPages <= 10) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  pageNumbers.push(1);
  if (currentPage > 4) {
    pageNumbers.push('ellipsis');
  }

  const start = Math.max(2, currentPage - 2);
  const end = Math.min(totalPages - 1, currentPage + 2);

  for (let i = start; i <= end; i++) {
    pageNumbers.push(i);
  }

  if (currentPage < totalPages - 3) {
    pageNumbers.push('ellipsis');
  }
  pageNumbers.push(totalPages);

  console.log(pageNumbers);

  return pageNumbers;
};

export default function Custom2Pagination(props: Custom2PaginationProps) {
  const {
    count,
    rowsPerPage,
    page,
    rowsPerPageOptions = [10, 20, 50],
    onPageChange,
    onRowsPerPageChange,
  } = props;

  const totalPages = Math.ceil(count / rowsPerPage);
  const startRow = page * rowsPerPage + 1;
  const endRow = Math.min((page + 1) * rowsPerPage, count);
  const pageNumbers = getPageNumbers(totalPages, page);

  console.log(`page`, page);

  return (
    <div className="flex items-center gap-4 p-4">
      <div className="flex items-center gap-2">
        <span className="text-sm">Rows per page:</span>
        <Select
          value={rowsPerPage.toString()}
          onValueChange={(value) => {
            if (onRowsPerPageChange) {
              onRowsPerPageChange(Number(value));
            }
          }}
        >
          <SelectTrigger className="w-16">
            <SelectValue placeholder={rowsPerPage} />
          </SelectTrigger>
          <SelectContent>
            {rowsPerPageOptions.map((option) => (
              <SelectItem
                key={typeof option === 'number' ? option : option.value}
                value={
                  typeof option === 'number'
                    ? option.toString()
                    : option.value.toString()
                }
              >
                {typeof option === 'number' ? option : option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="flex items-center gap-4">
        <span className="text-sm">
          {startRow}–{endRow} of {count}
        </span>
        <div className="flex items-center gap-1">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  href="#"
                  className={cn(
                    page > 0
                      ? 'border border-gray-700 bg-[#1a2634] text-gray-400'
                      : 'border border-gray-700 text-gray-400',
                  )}
                  isActive={page > 0}
                  onClick={(e) => {
                    e.preventDefault();
                    if (page > 0) {
                      onPageChange(page - 1);
                    }
                  }}
                />
              </PaginationItem>
              {pageNumbers.map((pageNumber, index) => {
                if (pageNumber === 'ellipsis') {
                  return (
                    <PaginationEllipsis
                      key={pageNumber + index}
                      className="border border-gray-700 text-gray-400"
                    />
                  );
                }

                return (
                  <PaginationItem key={pageNumber}>
                    <PaginationLink
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        onPageChange(Number(pageNumber) - 1);
                      }}
                      isActive={page === Number(pageNumber) - 1}
                      className={cn(
                        page === Number(pageNumber) - 1
                          ? 'border border-gray-700 bg-[#1a2634] text-gray-400'
                          : 'border border-gray-700 text-gray-400',
                      )}
                    >
                      {pageNumber}
                    </PaginationLink>
                  </PaginationItem>
                );
              })}
              <PaginationItem>
                <PaginationNext
                  href="#"
                  className={cn(
                    page < totalPages - 1
                      ? 'border border-gray-700 bg-[#1a2634] text-gray-400'
                      : 'border border-gray-700 text-gray-400',
                  )}
                  isActive={page < totalPages - 1} // Check if the current page is less than the last page
                  onClick={(e) => {
                    e.preventDefault();
                    if (page < totalPages - 1) {
                      onPageChange(page + 1);
                    }
                  }}
                />
              </PaginationItem>
              {/* <PaginationItem>
                <PaginationPrevious href="#" />
              </PaginationItem>
              <PaginationItem>
                <PaginationLink href="#">1</PaginationLink>
              </PaginationItem>
              <PaginationItem>
                <PaginationLink href="#" isActive>
                  2
                </PaginationLink>
              </PaginationItem>
              <PaginationItem>
                <PaginationLink href="#">3</PaginationLink>
              </PaginationItem>
              <PaginationItem>
                <PaginationEllipsis />
              </PaginationItem>
              <PaginationItem>
                <PaginationNext href="#" />
              </PaginationItem> */}
            </PaginationContent>
          </Pagination>
        </div>
      </div>
    </div>
  );
}
