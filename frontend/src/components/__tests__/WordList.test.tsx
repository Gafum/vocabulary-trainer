import { render, screen } from "@testing-library/react";
import { WordList } from "@/pages/Home/components/WordList";
import type { Word } from "../../../../shared/types";
import type { ReactNode } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { describe, test, expect } from "vitest";

const mockWords: Word[] = [
   {
      id: "1",
      term: "Hello",
      translation: "Hallo",
      lastReviewed: new Date().toISOString(),
      difficulty: 1,
      learned: false,
   },
   {
      id: "2",
      term: "World",
      translation: "Welt",
      lastReviewed: new Date().toISOString(),
      difficulty: 2,
      learned: true,
   },
];

export function renderWithQueryClient(ui: ReactNode) {
   const queryClient = new QueryClient();
   return render(
      <QueryClientProvider client={queryClient}>{ui}</QueryClientProvider>
   );
}

describe("WordList", () => {
   test("renders loading state", () => {
      renderWithQueryClient(
         <WordList
            words={[]}
            loading={true}
            error={null}
            editWord={() => {}}
            onSort={() => {}}
            sortOption={{ field: "term", order: "asc" }}
         />
      );

      expect(screen.getByText(/loading words/i)).toBeInTheDocument();
   });

   test("renders error state", () => {
      renderWithQueryClient(
         <WordList
            words={[]}
            loading={false}
            error="Failed to load words"
            editWord={() => {}}
            onSort={() => {}}
            sortOption={{ field: "term", order: "asc" }}
         />
      );

      expect(screen.getByText(/failed to load words/i)).toBeInTheDocument();
   });

   test("renders empty state", () => {
      renderWithQueryClient(
         <WordList
            words={[]}
            loading={false}
            error={null}
            editWord={() => {}}
            onSort={() => {}}
            sortOption={{ field: "term", order: "asc" }}
         />
      );

      expect(screen.getByText(/no words found/i)).toBeInTheDocument();
   });

   test("renders words correctly", () => {
      renderWithQueryClient(
         <WordList
            words={mockWords}
            loading={false}
            error={null}
            editWord={() => {}}
            onSort={() => {}}
            sortOption={{ field: "term", order: "asc" }}
         />
      );

      expect(screen.getByText("Hello")).toBeInTheDocument();
      expect(screen.getByText("Hallo")).toBeInTheDocument();
      expect(screen.getByText("World")).toBeInTheDocument();
      expect(screen.getByText("Welt")).toBeInTheDocument();
   });
});
