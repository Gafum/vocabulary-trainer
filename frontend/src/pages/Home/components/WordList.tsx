import React from "react";
import type { Word } from "@shared/types";
import { WordItem } from "./WordItem";
import { Icon } from "@/components/UI/Icon";

interface WordListProps {
   words: Word[];
   loading: boolean;
   error: unknown;
   onEdit: (word: Word) => void;
   onMarkLearned: (id: string, learned: boolean) => void;
   onSort: (field: keyof Word) => void;
   sortOption: {
      field: keyof Word;
      order: "asc" | "desc";
   };
}

export const WordList: React.FC<WordListProps> = ({
   words,
   loading,
   error,
   onEdit,
   onMarkLearned,
   onSort,
   sortOption,
}) => {
   const renderSortIcon = (field: keyof Word) => {
      if (sortOption.field !== field) return null;

      return sortOption.order === "asc" ? (
         <Icon name="ChevronUp" size={16} className="ml-1" />
      ) : (
         <Icon name="ChevronDown" size={16} className="ml-1" />
      );
   };

   if (loading) {
      return (
         <div className="flex justify-center py-8">
            <Icon name="Loader" size={24} className="animate-spin mr-2" />
            Loading words...
         </div>
      );
   }

   if (error) {
      return (
         <div className="text-red-500 py-4 flex items-center">
            <Icon name="AlertCircle" size={20} className="mr-2" />
            {error instanceof Error ? error.message : "Failed to load words"}
         </div>
      );
   }

   if (words.length === 0) {
      return (
         <div className="text-gray-500 py-4 flex items-center justify-center">
            <Icon name="Search" size={20} className="mr-2" />
            No words found
         </div>
      );
   }

   return (
      <div>
         <div className="mb-4 flex text-sm font-medium text-gray-600">
            <button
               onClick={() => onSort("term")}
               className="flex items-center mr-4 hover:text-blue-600 focus:outline-none"
               aria-label="Sort by term"
            >
               Term {renderSortIcon("term")}
            </button>
            <button
               onClick={() => onSort("translation")}
               className="flex items-center mr-4 hover:text-blue-600 focus:outline-none"
               aria-label="Sort by translation"
            >
               Translation {renderSortIcon("translation")}
            </button>
            <button
               onClick={() => onSort("difficulty")}
               className="flex items-center mr-4 hover:text-blue-600 focus:outline-none"
               aria-label="Sort by difficulty"
            >
               Difficulty {renderSortIcon("difficulty")}
            </button>
            <button
               onClick={() => onSort("lastReviewed")}
               className="flex items-center hover:text-blue-600 focus:outline-none"
               aria-label="Sort by last reviewed date"
            >
               Last Reviewed {renderSortIcon("lastReviewed")}
            </button>
         </div>

         <div>
            {words.map((word) => (
               <WordItem
                  key={word.id}
                  word={word}
                  onEdit={onEdit}
                  onMarkLearned={onMarkLearned}
               />
            ))}
         </div>
      </div>
   );
};
