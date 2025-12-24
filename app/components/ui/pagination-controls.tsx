import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface PaginationControlsProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  totalItems?: number; // Optional: মোট কতগুলো ডাটা আছে দেখানোর জন্য
  itemsPerPage?: number;
  className?: string;
}

export function PaginationControls({
  currentPage,
  totalPages,
  onPageChange,
  totalItems,
  itemsPerPage,
  className,
}: PaginationControlsProps) {
  // ক্যালকুলেশন (Showing X to Y of Z results)
  const startIndex = (currentPage - 1) * (itemsPerPage || 0);
  const endIndex = Math.min(startIndex + (itemsPerPage || 0), totalItems || 0);

  return (
    <div className={`flex items-center justify-between px-2 ${className}`}>
      {/* Left Side: Text Info */}
      <div className="text-sm text-muted-foreground">
        {totalItems && itemsPerPage ? (
          <>
            Showing <strong>{startIndex + 1}</strong> to{" "}
            <strong>{endIndex}</strong> of <strong>{totalItems}</strong> results
          </>
        ) : (
          <>
            Page <strong>{currentPage}</strong> of <strong>{totalPages}</strong>
          </>
        )}
      </div>

      {/* Right Side: Buttons */}
      <div className="flex items-center space-x-2">
        {/* First Page */}
        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8 hidden sm:flex"
          onClick={() => onPageChange(1)}
          disabled={currentPage === 1}
        >
          <span className="sr-only">Go to first page</span>
          <ChevronsLeft className="h-4 w-4" />
        </Button>

        {/* Previous Page */}
        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          <span className="sr-only">Go to previous page</span>
          <ChevronLeft className="h-4 w-4" />
        </Button>

        {/* Current Page Indicator */}
        <div className="flex items-center justify-center text-sm font-medium w-[100px]">
          Page {currentPage} of {totalPages}
        </div>

        {/* Next Page */}
        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages || totalPages === 0}
        >
          <span className="sr-only">Go to next page</span>
          <ChevronRight className="h-4 w-4" />
        </Button>

        {/* Last Page */}
        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8 hidden sm:flex"
          onClick={() => onPageChange(totalPages)}
          disabled={currentPage === totalPages || totalPages === 0}
        >
          <span className="sr-only">Go to last page</span>
          <ChevronsRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
