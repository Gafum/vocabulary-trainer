import React, { useState, useEffect, useRef } from "react";
import type { Word } from "../../../shared/types";
import { Button } from "./UI/Button";
import { Icon } from "./UI/Icon";

interface EditModalProps {
   word: Word | null;
   isOpen: boolean;
   onClose: () => void;
   onSave: (word: Word) => Promise<void>;
   isSubmitting: boolean;
}

export const EditModal: React.FC<EditModalProps> = ({
   word,
   isOpen,
   onClose,
   onSave,
   isSubmitting,
}) => {
   const [editedWord, setEditedWord] = useState<Word | null>(null);
   const [error, setError] = useState<string | null>(null);

   const modalRef = useRef<HTMLDivElement>(null);

   useEffect(() => {
      setEditedWord(word);
   }, [word]);

   useEffect(() => {
      const handleEscape = (e: KeyboardEvent) => {
         if (e.key === "Escape" && isOpen) {
            onClose();
         }
      };

      const handleClickOutside = (e: MouseEvent) => {
         if (
            modalRef.current &&
            !modalRef.current.contains(e.target as Node) &&
            isOpen
         ) {
            onClose();
         }
      };

      document.addEventListener("keydown", handleEscape);
      document.addEventListener("mousedown", handleClickOutside);

      return () => {
         document.removeEventListener("keydown", handleEscape);
         document.removeEventListener("mousedown", handleClickOutside);
      };
   }, [isOpen, onClose]);

   if (!isOpen || !editedWord) return null;

   const handleChange = (
      e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
   ) => {
      const { name, value } = e.target;
      setEditedWord({
         ...editedWord,
         [name]: name === "difficulty" ? parseInt(value, 10) : value,
      });
   };

   const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();

      if (!editedWord) return;

      if (!editedWord.term.trim() || !editedWord.translation.trim()) {
         setError("Please fill in both term and translation");
         return;
      }

      try {
         setError(null);
         await onSave(editedWord);
         onClose();
      } catch (err) {
         setError("Failed to update word");
         console.error(err);
      }
   };

   return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
         <div
            ref={modalRef}
            className="bg-white rounded-lg p-6 w-full max-w-md"
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
         >
            <div className="flex justify-between items-center mb-4">
               <h2 id="modal-title" className="text-xl font-bold">
                  Edit Word
               </h2>
               <Button
                  variant="secondary"
                  size="sm"
                  onClick={onClose}
                  aria-label="Close modal"
                  className="h-8 w-8 p-0 rounded-full"
                  icon={<Icon name="X" size={16} />}
               >
                  <span className="sr-only">Close</span>
               </Button>
            </div>

            <form onSubmit={handleSubmit}>
               {error && (
                  <div className="mb-4 p-2 bg-red-100 text-red-700 rounded-md">
                     {error}
                  </div>
               )}

               <div className="mb-4 inputes">
                  <input
                     id="edit-term"
                     name="term"
                     type="text"
                     value={editedWord.term}
                     onChange={handleChange}
                     disabled={isSubmitting}
                     required
                  />
                  <label htmlFor="edit-term">Term</label>
               </div>

               <div className="mb-4 inputes">
                  <input
                     id="edit-translation"
                     name="translation"
                     type="text"
                     value={editedWord.translation}
                     required
                     disabled={isSubmitting}
                  />
                  <label htmlFor="edit-translation">Translation</label>
               </div>

               <div className="mb-6">
                  <label
                     htmlFor="edit-difficulty"
                     className="block text-sm font-medium text-gray-700 mb-1"
                  >
                     Difficulty (1-5)
                  </label>
                  <div className="flex items-center">
                     <input
                        id="edit-difficulty"
                        name="difficulty"
                        type="range"
                        min="1"
                        max="5"
                        value={editedWord.difficulty}
                        onChange={handleChange}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                        disabled={isSubmitting}
                     />
                     <span className="ml-2 text-gray-700 font-medium">
                        {editedWord.difficulty}
                     </span>
                  </div>
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                     <span>Very Easy</span>
                     <span>Very Hard</span>
                  </div>
               </div>

               <div className="flex justify-end space-x-3">
                  <Button
                     type="button"
                     variant="outline"
                     onClick={onClose}
                     disabled={isSubmitting}
                  >
                     Cancel
                  </Button>
                  <Button
                     type="submit"
                     variant="primary"
                     disabled={isSubmitting}
                     icon={
                        isSubmitting ? (
                           <Icon name="Loader" className="animate-spin" />
                        ) : undefined
                     }
                  >
                     {isSubmitting ? "Saving..." : "Save Changes"}
                  </Button>
               </div>
            </form>
         </div>
      </div>
   );
};
