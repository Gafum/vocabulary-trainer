import { useState } from "react";
import type { Word } from "@shared/types";
import { useDebounce } from "@/hooks/useDebounce";
import { useWordsQuery } from "@/hooks/useWordsQuery";

interface UseHomeLogicReturn {
   searchTerm: string;
   sortOption: { field: keyof Word; order: "asc" | "desc" };
   currentPage: number;
   editingWord: Word | null;
   isModalOpen: boolean;

   wordsData: ReturnType<typeof useWordsQuery>["data"];
   isLoading: boolean;
   error: unknown;

   handleSearch: (term: string) => void;
   handleSort: (field: keyof Word) => void;
   handlePageChange: (page: number) => void;
   handleEditWord: (word: Word) => void;
   handleCloseModal: () => void;
}

export const useHomeLogic = (): UseHomeLogicReturn => {
   // ---------- UI STATES ----------
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

   // ---------- HELPERS ----------
   const debouncedSearchTerm = useDebounce(searchTerm, 500);
   const ITEMS_PER_PAGE = 5;

   // ---------- DATA FETCHING ----------
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

   // ---------- HANDLERS ----------
   const handleSearch = (term: string) => {
      setSearchTerm(term);
      setCurrentPage(1); // Reset to first page when searching
   };

   const handleSort = (field: keyof Word) => {
      setSortOption((prev) => ({
         field,
         order: prev.field === field && prev.order === "asc" ? "desc" : "asc",
      }));
      setCurrentPage(1);  // Reset to first page when sort changes
   };

   const handlePageChange = (page: number) => {
      setCurrentPage(page);
   };

   const handleEditWord = (word: Word) => {
      // Open Modal if the edit button in WordItem is clicked
      setEditingWord(word);
      setIsModalOpen(true);
   };

   const handleCloseModal = () => {
      setIsModalOpen(false);
      setEditingWord(null);
   };

   return {
      searchTerm,
      sortOption,
      currentPage,
      editingWord,
      isModalOpen,
      wordsData,
      isLoading,
      error,
      handleSearch,
      handleSort,
      handlePageChange,
      handleEditWord,
      handleCloseModal,
   };
};
