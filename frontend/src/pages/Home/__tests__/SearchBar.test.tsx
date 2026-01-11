import { render, screen, fireEvent } from "@testing-library/react";
import { SearchBar } from "@/pages/Home/components/SearchBar";
import { describe, expect, test, vi } from "vitest";

vi.mock("../UI/Icon", () => ({
   Icon: ({ name }: { name: string }) => (
      <span data-testid={`icon-${name.toLowerCase()}`}>{name}</span>
   ),
}));

describe("SearchBar", () => {
   test("renders correctly", () => {
      render(<SearchBar searchTerm="" onSearch={() => { }} />);

      //it will be as aria-label text
      expect(
         screen.getByLabelText(/search for vocabulary words/i)
      ).toBeInTheDocument();
   });

   test("calls onSearch when input changes", () => {
      const mockOnSearch = vi.fn();
      render(<SearchBar searchTerm="" onSearch={mockOnSearch} />);

      const input = screen.getByLabelText(/search for vocabulary words/i);
      fireEvent.change(input, { target: { value: "test" } });

      expect(mockOnSearch).toHaveBeenCalledWith("test");
   });

   test("displays the current search term", () => {
      render(<SearchBar searchTerm="hello" onSearch={() => { }} />);

      // it will be as aria-label text
      const input = screen.getByLabelText(
         /search for vocabulary words/i
      ) as HTMLInputElement;
      // Value should be "hello"
      expect(input.value).toBe("hello");
   });

   test("clear button calls onSearch with empty string", () => {
      const mockOnSearch = vi.fn();
      render(<SearchBar searchTerm="hello" onSearch={mockOnSearch} />);

      // simulate click on clear button
      const clearButton = screen.getByLabelText(/clear search/i);
      fireEvent.click(clearButton);

      expect(mockOnSearch).toHaveBeenCalledWith("");
   });
});
