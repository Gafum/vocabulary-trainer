import React, { useState } from "react";
import type { CreateWordPayload } from "@shared/types";
import { Button } from "@/components/UI/Button";
import { Icon } from "@/components/UI/Icon";

interface WordInputProps {
   onAddWord: (word: CreateWordPayload) => Promise<void>;
   isSubmitting: boolean;
}

export const WordInput: React.FC<WordInputProps> = ({
   onAddWord,
   isSubmitting,
}) => {
   const [term, setTerm] = useState("");
   const [translation, setTranslation] = useState("");
   const [difficulty, setDifficulty] = useState<number>(3);
   const [error, setError] = useState<string | null>(null);

   const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();

      if (!term.trim() || !translation.trim()) {
         setError("Please fill in both term and translation");
         return;
      }

      try {
         setError(null);

         await onAddWord({
            term: term.trim(),
            translation: translation.trim(),
            difficulty,
         });

         // Reset form
         setTerm("");
         setTranslation("");
         setDifficulty(3);
      } catch (err) {
         setError("Failed to add word");
         console.error(err);
      }
   };

   return (
      <div className="bg-white p-6 rounded-lg shadow-md">
         <h2 className="text-xl font-bold mb-4">Add New Word</h2>

         <form onSubmit={handleSubmit}>
            {error && (
               <div className="mb-4 p-2 bg-red-100 text-red-700 rounded-md flex items-center">
                  <Icon name="AlertCircle" size={16} className="mr-2" />
                  {error}
               </div>
            )}

            <div className="mb-4 inputes">
               <input
                  id="term"
                  type="text"
                  value={term}
                  onChange={(e) => setTerm(e.target.value)}
                  disabled={isSubmitting}
                  required
               />
               <label htmlFor="term">Term</label>
            </div>

            <div className="mb-4 inputes">
               <input
                  id="translation"
                  type="text"
                  value={translation}
                  onChange={(e) => setTranslation(e.target.value)}
                  disabled={isSubmitting}
                  required
               />
               <label htmlFor="translation">Translation</label>
            </div>

            <div className="mb-6">
               <label
                  htmlFor="difficulty"
                  className="block text-sm font-medium text-gray-700 mb-1"
               >
                  Difficulty (1-5)
               </label>
               <div className="flex items-center">
                  <input
                     id="difficulty"
                     type="range"
                     min="1"
                     max="5"
                     value={difficulty}
                     onChange={(e) => setDifficulty(parseInt(e.target.value))}
                     className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                     disabled={isSubmitting}
                  />
                  <span className="ml-2 text-gray-700 font-medium">
                     {difficulty}
                  </span>
               </div>
               <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>Very Easy</span>
                  <span>Very Hard</span>
               </div>
            </div>

            <Button
               type="submit"
               variant="primary"
               fullWidth
               disabled={isSubmitting}
               icon={
                  isSubmitting ? (
                     <Icon name="Loader" className="animate-spin" />
                  ) : (
                     <Icon name="Plus" />
                  )
               }
            >
               {isSubmitting ? "Adding..." : "Add Word"}
            </Button>
         </form>
      </div>
   );
};
