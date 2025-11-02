import { useState, useEffect, useRef } from 'react';
import type { Word } from '../../../shared/types';
import { fetchWords, updateWord } from '../services/api';
import { useDebounce } from './useDebounce';

type SortOption = {
  field: keyof Word;
  order: 'asc' | 'desc';
};

export function useWords() {
  const [words, setWords] = useState<Word[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [sortOption, setSortOption] = useState<SortOption>({
    field: 'term',
    order: 'asc',
  });
  
  const debouncedSearchTerm = useDebounce(searchTerm, 500);
  const ITEMS_PER_PAGE = 5;
  
  // Controller for cancelling previous requests
  const abortControllerRef = useRef<AbortController | null>(null);

  useEffect(() => {
    const loadWords = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Cancel previous request if it exists
        if (abortControllerRef.current) {
          abortControllerRef.current.abort();
        }
        
        // Create new abort controller
        abortControllerRef.current = new AbortController();
        
        const response = await fetchWords(
          currentPage,
          ITEMS_PER_PAGE,
          debouncedSearchTerm,
          sortOption.field,
          sortOption.order
        );
        
        setWords(response.data);
        setTotalPages(response.totalPages);
      } catch (err) {
        if (err instanceof Error && err.name !== 'AbortError') {
          setError('Failed to fetch words');
          console.error(err);
        }
      } finally {
        setLoading(false);
      }
    };

    loadWords();
    
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [currentPage, debouncedSearchTerm, sortOption]);

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    setCurrentPage(1); // Reset to first page on new search
  };

  const handleSort = (field: keyof Word) => {
    setSortOption(prev => ({
      field,
      order: prev.field === field && prev.order === 'asc' ? 'desc' : 'asc',
    }));
    setCurrentPage(1); // Reset to first page on new sort
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleMarkAsLearned = async (id: string, learned: boolean) => {
    try {
      const wordToUpdate = words.find(word => word.id === id);
      if (!wordToUpdate) return;
      
      const updatedWord = { ...wordToUpdate, learned };
      await updateWord(updatedWord);
      
      setWords(prev => 
        prev.map(word => word.id === id ? { ...word, learned } : word)
      );
    } catch (err) {
      setError('Failed to update word');
      console.error(err);
    }
  };

  return {
    words,
    loading,
    error,
    searchTerm,
    currentPage,
    totalPages,
    sortOption,
    handleSearch,
    handleSort,
    handlePageChange,
    handleMarkAsLearned,
  };
}