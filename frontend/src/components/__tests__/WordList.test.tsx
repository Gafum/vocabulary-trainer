import { render, screen } from "@testing-library/react";
import { WordList } from "../WordList";
import type { Word } from "../../../../shared/types";

import { describe, test, expect } from 'vitest';

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

describe("WordList", () => {
   test("renders loading state", () => {
      render(
         <WordList
            words={[]}
            loading={true}
            error={null}
            onEdit={() => {}}
            onMarkLearned={() => {}}
            onSort={() => {}}
            sortOption={{ field: "term", order: "asc" }}
         />
      );

      expect(screen.getByText(/loading words/i)).toBeInTheDocument();
   });

   test("renders error state", () => {
      render(
         <WordList
            words={[]}
            loading={false}
            error="Failed to load words"
            onEdit={() => {}}
            onMarkLearned={() => {}}
            onSort={() => {}}
            sortOption={{ field: "term", order: "asc" }}
         />
      );

      expect(screen.getByText(/failed to load words/i)).toBeInTheDocument();
   });

   test("renders empty state", () => {
      render(
         <WordList
            words={[]}
            loading={false}
            error={null}
            onEdit={() => {}}
            onMarkLearned={() => {}}
            onSort={() => {}}
            sortOption={{ field: "term", order: "asc" }}
         />
      );

      expect(screen.getByText(/no words found/i)).toBeInTheDocument();
   });

   test("renders words correctly", () => {
      render(
         <WordList
            words={mockWords}
            loading={false}
            error={null}
            onEdit={() => {}}
            onMarkLearned={() => {}}
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
