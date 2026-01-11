import { useState, useEffect } from "react";

export function useDebounce<T>(value: T, delay: number): T {
   const [debouncedValue, setDebouncedValue] = useState<T>(value);
   // Update debounced value after delay
   useEffect(() => {
      const handler = setTimeout(() => {
         setDebouncedValue(value);
      }, delay);

      // Cleanup timeout if value or delay changes
      return () => {
         clearTimeout(handler);
      };
   }, [value, delay]);

   return debouncedValue;
}
