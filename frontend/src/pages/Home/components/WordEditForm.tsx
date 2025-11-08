import React, { useState, useEffect } from "react";
import type { Word } from "@shared/types";
import { Button } from "@/components/UI/Button";
import { Icon } from "@/components/UI/Icon";
import { useUpdateWordMutation } from "@/hooks/useWordsQuery";

interface WordEditFormProps {
   word: Word | null;
   setOpen: (open: boolean) => void;
}

export const WordEditForm: React.FC<WordEditFormProps> = ({
   word,
   setOpen,
}) => {
   const [form, setForm] = useState<Word | null>(word);
   const [error, setError] = useState<string | null>(null);

   const { mutateAsync, isPending } = useUpdateWordMutation();

   useEffect(() => setForm(word), [word]);

   if (!form) return null;

   const handleChange = (
      e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
   ) => {
      const { name, value } = e.target;
      setForm({
         ...form,
         [name]: name === "difficulty" ? parseInt(value, 10) : value,
      });
   };

   const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      if (!form.term.trim() || !form.translation.trim()) {
         setError("Please fill in both fields");
         return;
      }
      try {
         await mutateAsync(form);
         setOpen(false);
      } catch {
         setError("Failed to update word");
      }
   };

   return (
      <form onSubmit={handleSubmit}>
         <h2 className="text-xl font-bold mb-4">Edit Word</h2>
         {error && (
            <div className="p-2 mb-3 bg-red-100 text-red-700 rounded">
               {error}
            </div>
         )}

         <div className="inputes mb-3">
            <input
               name="term"
               value={form.term}
               onChange={handleChange}
               disabled={isPending}
            />
            <label htmlFor="term">Term</label>
         </div>

         <div className="inputes mb-3">
            <input
               name="translation"
               value={form.translation}
               onChange={handleChange}
               disabled={isPending}
            />
            <label htmlFor="translation">Translation</label>
         </div>

         <div className="mb-6">
            <label
               htmlFor="edit-difficulty"
               className="block text-sm font-medium text-gray-700 mb-1"
            >
               Difficulty
            </label>
            <div className="flex items-center">
               <input
                  id="edit-difficulty"
                  name="difficulty"
                  type="range"
                  min="1"
                  max="5"
                  value={form.difficulty}
                  onChange={handleChange}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  disabled={isPending}
               />
               <span className="ml-2 text-gray-700 font-medium">
                  {form.difficulty}
               </span>
            </div>
            <div className="flex justify-between text-xs text-gray-500 mt-1">
               <span>Very Easy</span>
               <span>Very Hard</span>
            </div>
         </div>

         <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setOpen(false)}>
               Cancel
            </Button>
            <Button
               type="submit"
               variant="primary"
               disabled={isPending}
               icon={
                  isPending ? (
                     <Icon name="Loader" className="animate-spin" />
                  ) : undefined
               }
            >
               {isPending ? "Saving..." : "Save"}
            </Button>
         </div>
      </form>
   );
};
