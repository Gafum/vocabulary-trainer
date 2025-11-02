import { renderHook, act } from "@testing-library/react";
import { useDebounce } from "../useDebounce";

import { describe, test, expect, beforeEach, vi, afterEach } from "vitest";

describe("useDebounce", () => {
   beforeEach(() => {
      vi.useFakeTimers();
   });

   afterEach(() => {
      vi.useRealTimers();
   });

   test("should return the initial value immediately", () => {
      const { result } = renderHook(() => useDebounce("initial", 500));
      expect(result.current).toBe("initial");
   });

   test("should debounce value changes", () => {
      const { result, rerender } = renderHook(
         ({ value, delay }) => useDebounce(value, delay),
         { initialProps: { value: "initial", delay: 500 } }
      );

      // Change the value
      rerender({ value: "changed", delay: 500 });

      // Value should not change immediately
      expect(result.current).toBe("initial");

      // Fast-forward time by 250ms
      act(() => {
         vi.advanceTimersByTime(250);
      });

      // Value should still be the initial value
      expect(result.current).toBe("initial");

      // Fast-forward time to 500ms
      act(() => {
         vi.advanceTimersByTime(250);
      });

      // Now the value should be updated
      expect(result.current).toBe("changed");
   });

   test("should reset the timer when value changes before delay", () => {
      const { result, rerender } = renderHook(
         ({ value, delay }) => useDebounce(value, delay),
         { initialProps: { value: "initial", delay: 500 } }
      );

      // Change the value
      rerender({ value: "changed", delay: 500 });

      // Fast-forward time by 400ms
      act(() => {
         vi.advanceTimersByTime(400);
      });

      // Value should still be the initial value
      expect(result.current).toBe("initial");

      // Change the value again
      rerender({ value: "changed again", delay: 500 });

      // Fast-forward time by 400ms
      act(() => {
         vi.advanceTimersByTime(400);
      });

      // Value should still be the initial value
      expect(result.current).toBe("initial");

      // Fast-forward time to complete the delay
      act(() => {
         vi.advanceTimersByTime(100);
      });

      // Now the value should be updated to the latest value
      expect(result.current).toBe("changed again");
   });
});
