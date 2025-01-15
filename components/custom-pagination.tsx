'use client';

import { useEffect, useState } from 'react';

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';

interface PaginationWithSelectProps {
  currentPage: number;
  itemsPerPage: number;
  totalItems?: number;
  defaultItemsPerPage?: number;
  className?: string;
  onItemsPerPageChange: (itemsPerPage: number) => void;
  onCurrentPageChange: (currentPage: number) => void;
}

export default function CustomPagination({
  currentPage,
  itemsPerPage,
  totalItems = 1,
  className = '',
  onItemsPerPageChange,
  onCurrentPageChange,
}: PaginationWithSelectProps) {
  const [inputPage, setInputPage] = useState(currentPage);
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  // const startItem = totalPages ? (currentPage - 1) * itemsPerPage + 1 : 0;
  // const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  useEffect(() => {
    setInputPage(currentPage);
  }, [currentPage]);

  useEffect(() => {
    if (onItemsPerPageChange) {
      // console.log('itemsPerPage', itemsPerPage)
      onItemsPerPageChange(itemsPerPage);
    }
  }, [itemsPerPage, onItemsPerPageChange]);

  useEffect(() => {
    if (onCurrentPageChange) {
      // console.log('currentPage', currentPage)
      onCurrentPageChange(currentPage);
    }
  }, [currentPage, onCurrentPageChange]);

  // console.log("currentPage", currentPage);

  const getPageNumbers = () => {
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

  const handlePageInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value, 10);
    if (
      !isNaN(value) &&
      value > 0 &&
      value <= Math.ceil(totalItems / itemsPerPage)
    ) {
      setInputPage(value);
      onCurrentPageChange(value);
    }
  };

  const pageNumbers = getPageNumbers();

  return (
    <div className={`dark flex items-center justify-between p-4 ${className}`}>
      <div className="flex items-center gap-2 text-sm text-gray-400">
        <span className="text-sm">Items per page</span>
        <Select
          value={itemsPerPage.toString()}
          onValueChange={(value) => onCurrentPageChange(Number(value))}
        >
          <SelectTrigger className="h-8 w-[70px]">
            <SelectValue placeholder={itemsPerPage} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="10">10</SelectItem>
            <SelectItem value="20">20</SelectItem>
            <SelectItem value="30">30</SelectItem>
            <SelectItem value="40">40</SelectItem>
            <SelectItem value="50">50</SelectItem>
          </SelectContent>
        </Select>
        <div className="ml-2 flex items-center space-x-2">
          <span className="text-sm">Page</span>
          <Input
            type="number"
            value={inputPage}
            onChange={handlePageInputChange}
            className="w-16 text-center"
            min={1}
            max={Math.ceil(totalItems / itemsPerPage)}
          />
          <span className="text-sm">
            of {Math.ceil(totalItems / itemsPerPage)}
          </span>
        </div>
      </div>

      <div>
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  onCurrentPageChange(Math.max(1, currentPage - 1));
                }}
              />
            </PaginationItem>

            {pageNumbers.map((pageNumber) => {
              if (pageNumber === 'ellipsis') {
                return (
                  <PaginationEllipsis
                    key={pageNumber}
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
                      onCurrentPageChange(Number(pageNumber));
                    }}
                    isActive={currentPage === pageNumber}
                    className={cn(
                      currentPage === pageNumber
                        ? 'border border-gray-700 bg-[#1a2634] text-gray-400'
                        : 'border border-gray-700 text-gray-400',
                    )}
                  >
                    {pageNumber}
                  </PaginationLink>
                </PaginationItem>
              );
            })}

            {/* {totalPages <= 10 ? (
              [...Array(totalPages)].map((_, i) => (
                <PaginationItem key={i + 1}>
                  <PaginationLink
                    href="#"
                    onClick={(e) => {
                      e.preventDefault()
                      setCurrentPage(i + 1)
                    }}
                    isActive={currentPage === i + 1}
                  >
                    {i + 1}
                  </PaginationLink>
                </PaginationItem>
              ))
            ) : (
              <>
                <PaginationItem>
                  <PaginationLink
                    href="#"
                    onClick={(e) => {
                      e.preventDefault()
                      setCurrentPage(1)
                    }}
                    isActive={currentPage === 1}
                  >
                    1
                  </PaginationLink>
                </PaginationItem>
                {currentPage > 4 && <PaginationEllipsis />}
                {[...Array(5)].map((_, i) => {
                  const page = Math.max(
                    2,
                    Math.min(currentPage - 2 + i, totalPages - 1)
                  )
                  return (
                    <PaginationItem key={page}>
                      <PaginationLink
                        href="#"
                        onClick={(e) => {
                          e.preventDefault()
                          setCurrentPage(page)
                        }}
                        isActive={currentPage === page}
                      >
                        {page}
                      </PaginationLink>
                    </PaginationItem>
                  )
                }).filter((item, index, self) => 
                  index === self.findIndex((t) => t.key === item.key)
                )}
                {currentPage < totalPages - 3 && <PaginationEllipsis />}
                <PaginationItem>
                  <PaginationLink
                    href="#"
                    onClick={(e) => {
                      e.preventDefault()
                      setCurrentPage(totalPages)
                    }}
                    isActive={currentPage === totalPages}
                  >
                    {totalPages}
                  </PaginationLink>
                </PaginationItem>
              </>
            )} */}

            <PaginationItem>
              <PaginationNext
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  onCurrentPageChange(Math.min(totalPages, currentPage + 1));
                }}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  );
}
