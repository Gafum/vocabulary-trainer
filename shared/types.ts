import z from "zod";
import { CreateWordSchema, WordSchema } from "./schemas";

export type Word = z.infer<typeof WordSchema>;

export type CreateWordPayload = z.infer<typeof CreateWordSchema>;

export interface PagedResponse<T> {
   data: T[];
   page: number;
   totalPages: number;
}

export interface FetchWordsQueryParams {
   page?: number;
   limit?: number;
   search?: string | "";
   sortBy?: keyof Word;
   order?: "asc" | "desc";
}
