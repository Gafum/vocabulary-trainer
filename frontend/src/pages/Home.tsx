import React, { useState } from "react";
import type { Word } from "../../../shared/types";
import { SearchBar } from "../components/SearchBar";
import { WordList } from "../components/WordList";
import { WordInput } from "../components/WordInput";
import { Pagination } from "../components/Pagination";
import { EditModal } from "../components/EditModal";
import { useDebounce } from "../hooks/useDebounce";
import {
   useWordsQuery,
   useAddWordMutation,
   useUpdateWordMutation,
} from "../hooks/useWordsQuery";

export const Home: React.FC = () => {
   const [searchTerm, setSearchTerm] = useState("");
   const [currentPage, setCurrentPage] = useState(1);
   const [sortOption, setSortOption] = useState<{
      field: keyof Word;
      order: "asc" | "desc";
   }>({
      field: "term",
      order: "asc",
   });

   const [editingWord, setEditingWord] = useState<Word | null>(null);
   const [isModalOpen, setIsModalOpen] = useState(false);

   const debouncedSearchTerm = useDebounce(searchTerm, 500);
   const ITEMS_PER_PAGE = 5;

   // React Query hooks
   const {
      data: wordsData,
      isLoading,
      error,
   } = useWordsQuery(
      currentPage,
      ITEMS_PER_PAGE,
      debouncedSearchTerm,
      sortOption.field,
      sortOption.order
   );

   const addWordMutation = useAddWordMutation();
   const updateWordMutation = useUpdateWordMutation();

   const handleSearch = (term: string) => {
      setSearchTerm(term);
      setCurrentPage(1); // Reset to first page on new search
   };

   const handleSort = (field: keyof Word) => {
      setSortOption((prev) => ({
         field,
         order: prev.field === field && prev.order === "asc" ? "desc" : "asc",
      }));
      setCurrentPage(1); // Reset to first page on new sort
   };

   const handlePageChange = (page: number) => {
      setCurrentPage(page);
   };

   const handleAddWord = async (wordPayload: Omit<Word, "id">) => {
      await addWordMutation.mutateAsync(wordPayload);
   };

   const handleEditWord = (word: Word) => {
      setEditingWord(word);
      setIsModalOpen(true);
   };

   const handleSaveEdit = async (updatedWord: Word) => {
      await updateWordMutation.mutateAsync(updatedWord);
   };

   const handleMarkAsLearned = async (id: string, learned: boolean) => {
      const wordToUpdate = wordsData?.data.find((word) => word.id === id);
      if (!wordToUpdate) return;

      updateWordMutation.mutate({ ...wordToUpdate, learned });
   };

   const handleCloseModal = () => {
      setIsModalOpen(false);
      setEditingWord(null);
   };

   return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
         <h1 className="text-3xl font-bold mb-8 text-center">
            Mini Vokabeltrainer
         </h1>

         <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-1">
               <WordInput
                  onAddWord={(wordPayload) =>
                     handleAddWord({ ...wordPayload, lastReviewed: "" })
                  }
                  isSubmitting={addWordMutation.isPending}
               />
            </div>

            <div className="md:col-span-2">
               <div className="bg-white p-6 rounded-lg shadow-md">
                  <SearchBar searchTerm={searchTerm} onSearch={handleSearch} />

                  <WordList
                     words={wordsData?.data || []}
                     loading={isLoading}
                     error={error}
                     onEdit={handleEditWord}
                     onMarkLearned={handleMarkAsLearned}
                     onSort={handleSort}
                     sortOption={sortOption}
                  />

                  <Pagination
                     currentPage={currentPage}
                     totalPages={wordsData?.totalPages || 1}
                     onPageChange={handlePageChange}
                  />
               </div>
            </div>
         </div>

         <EditModal
            word={editingWord}
            isOpen={isModalOpen}
            onClose={handleCloseModal}
            onSave={handleSaveEdit}
            isSubmitting={updateWordMutation.isPending}
         />
      </div>
   );
};
