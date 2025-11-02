export interface Word {
  id: string;
  term: string;
  translation: string;
  lastReviewed: string;
  difficulty: number;   // 1–5
  learned?: boolean;
}

export interface CreateWordPayload {
  term: string;
  translation: string;
  difficulty: number;
}

export interface PagedResponse<T> {
  data: T[];
  page: number;
  totalPages: number;
}