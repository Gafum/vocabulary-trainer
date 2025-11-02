import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { Word, CreateWordPayload } from "../../../shared/types";
import { fetchWords, addWord, updateWord, deleteWord } from "../services/api";

// Query keys
export const wordKeys = {
   all: ["words"] as const,
   lists: () => [...wordKeys.all, "list"] as const,
   list: (filters: {
      page: number;
      limit: number;
      searchTerm: string;
      sortBy: keyof Word;
      sortOrder: "asc" | "desc";
   }) => [...wordKeys.lists(), filters] as const,
   details: () => [...wordKeys.all, "detail"] as const,
   detail: (id: string) => [...wordKeys.details(), id] as const,
};

export const useWordsQuery = (
   page: number,
   limit: number,
   searchTerm: string,
   sortBy: keyof Word,
   sortOrder: "asc" | "desc"
) => {
   return useQuery({
      queryKey: wordKeys.list({ page, limit, searchTerm, sortBy, sortOrder }),
      queryFn: () => fetchWords(page, limit, searchTerm, sortBy, sortOrder),
   });
};

export const useAddWordMutation = () => {
   const queryClient = useQueryClient();

   return useMutation({
      mutationFn: (newWord: CreateWordPayload) => addWord(newWord),
      onSuccess: () => {
         // Invalidate and refetch
         queryClient.invalidateQueries({ queryKey: wordKeys.lists() });
      },
   });
};

export const useUpdateWordMutation = () => {
   const queryClient = useQueryClient();

   return useMutation({
      mutationFn: (updatedWord: Word) => updateWord(updatedWord),
      onSuccess: (data) => {
         // Invalidate and refetch
         queryClient.invalidateQueries({ queryKey: wordKeys.lists() });
         queryClient.invalidateQueries({ queryKey: wordKeys.detail(data.id) });
      },
   });
};

export const useDeleteWordMutation = () => {
   const queryClient = useQueryClient();

   return useMutation({
      mutationFn: (id: string) => deleteWord(id),
      onSuccess: () => {
         // Invalidate and refetch
         queryClient.invalidateQueries({ queryKey: wordKeys.lists() });
      },
   });
};

export const useMarkAsLearnedMutation = () => {
   const { mutateAsync: updateMutateAsync, ...rest } = useUpdateWordMutation();

   return {
      mutateAsync: async (word: Word, learned: boolean) => {
         return await updateMutateAsync({ ...word, learned });
      },
      ...rest,
   };
};
