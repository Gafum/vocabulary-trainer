import React from "react";
import { Button } from "@/components/UI/Button";
import { Icon } from "@/components/UI/Icon";

interface PaginationProps {
   currentPage: number;
   totalPages: number;
   onPageChange: (page: number) => void;
}

export const Pagination: React.FC<PaginationProps> = ({
   currentPage,
   totalPages,
   onPageChange,
}) => {
   if (totalPages <= 1) return "";

   return (
      <div className="flex justify-center items-center mt-6 space-x-2">
         <Button
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
            variant="secondary"
            size="sm"
            aria-label="Previous page"
         >
            <Icon name="ChevronLeft" size={16} />
            Previous
         </Button>

         <span className="text-sm text-gray-700">
            Page {currentPage} of {totalPages}
         </span>

         <Button
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            variant="secondary"
            size="sm"
            aria-label="Next page"
         >
            Next
            <Icon name="ChevronRight" size={16} />
         </Button>
      </div>
   );
};
