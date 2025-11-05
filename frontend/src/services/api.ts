import axios from "axios";
import type {
   Word,
   CreateWordPayload,
   PagedResponse,
   FetchWordsQueryParams,
} from "@shared/types";

// API configuration
const API_BASE_URL =
   import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";
const API_KEY = import.meta.env.VITE_API_KEY || "12345";

const api = axios.create({
   baseURL: API_BASE_URL,
   headers: {
      "Content-Type": "application/json",
      "X-Api-Key": API_KEY,
   },
});

export const getWord = async (id: string): Promise<Word> => {
   const { data } = await api.get<Word>(`/api/words/${id}`);
   return data;
};

export const fetchWords = async (
   params: FetchWordsQueryParams
): Promise<PagedResponse<Word>> => {
   const { data } = await api.get<PagedResponse<Word>>("/api/words", {
      params,
   });
   return data;
};

export const addWord = async (payload: CreateWordPayload): Promise<Word> => {
   const { data } = await api.post<Word>("/api/words", payload);
   return data;
};

export const updateWord = async (word: Word): Promise<Word> => {
   const { data } = await api.put<Word>(`/api/words/${word.id}`, word);
   return data;
};

// Not implemented in backend
// export const deleteWord = async (id: string): Promise<void> => {
//   await api.delete(`/api/words/${id}`);
// };
