import React from "react";
import { Button } from "@/components/UI/Button";
import { Icon } from "@/components/UI/Icon";

interface SearchBarProps {
   searchTerm: string;
   onSearch: (term: string) => void;
}

export const SearchBar: React.FC<SearchBarProps> = ({
   searchTerm,
   onSearch,
}) => {
   //Did not use custom input for search, because it can cause some issues
   return (
      <div className="mb-4">
         <label
            htmlFor="search"
            className="block text-sm font-medium text-primaryGrey mb-1"
         >
            Search Words
         </label>
         <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
               <Icon name="Search" size={18} className="text-gray-400 search" />
            </div>

            <input
               id="search"
               type="text"
               value={searchTerm}
               onChange={(e) => onSearch(e.target.value)}
               placeholder="Search terms or translations..."
               className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primaryBlue focus:border-primaryBlue"
               aria-label="Search for vocabulary words"
            />

            {searchTerm && (
               <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                  <Button
                     variant="secondary"
                     size="sm"
                     onClick={() => onSearch("")}
                     aria-label="Clear search"
                     className="h-7 w-7 p-0 rounded-full"
                     icon={<Icon name="X" size={16} />}
                  >
                     <span className="sr-only">Clear</span>
                  </Button>
               </div>
            )}
         </div>
      </div>
   );
};
