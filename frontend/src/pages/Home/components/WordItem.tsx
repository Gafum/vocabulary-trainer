import React from "react";
import type { Word } from "@shared/types";
import { Button } from "@/components/UI/Button";
import { Icon } from "@/components/UI/Icon";
import { useUpdateWordMutation } from "@/hooks/useWordsQuery";

interface WordItemProps {
   word: Word;
   editWord: (word: Word) => void;
}

const formatDate = (dateString: string) => {
   const date = new Date(dateString);
   return date.toLocaleDateString();
};

const getDifficultyLabel = (difficulty: number) => {
   const labels = ["Very Easy", "Easy", "Medium", "Hard", "Very Hard"];
   return labels[difficulty - 1] || "Unknown";
};

export const WordItem: React.FC<WordItemProps> = React.memo(
   ({ word, editWord }) => {
      const updateMutation = useUpdateWordMutation();

      const handleMarkAsLearned = async (learned: boolean) => {
         updateMutation.mutate({ ...word, learned });
      };

      return (
         <div
            className={`p-4 border rounded-lg mb-2 shadow-sm transition-all ${
               word.learned ? "bg-green-50" : "bg-white"
            }`}
         >
            <div className="flex justify-between items-start">
               <div>
                  <h3 className="text-lg font-medium">{word.term}</h3>
                  <p className="text-primaryGrey">{word.translation}</p>
                  <div className="mt-2 flex items-center text-sm text-gray-500">
                     <span className="mr-4">
                        Last reviewed: {formatDate(word.lastReviewed)}
                     </span>
                     <span
                        className={`px-2 py-1 rounded-full text-xs ${
                           word.difficulty <= 2
                              ? "bg-green-100 text-primaryGreen"
                              : word.difficulty === 3
                              ? "bg-yellow-100 text-primaryYellow"
                              : "bg-red-100 text-primaryRed"
                        }`}
                     >
                        {getDifficultyLabel(word.difficulty)}
                     </span>
                  </div>
               </div>
               <div className="flex space-x-2">
                  <Button
                     variant={word.learned ? "success" : "secondary"}
                     size="sm"
                     onClick={() => handleMarkAsLearned(!word.learned)}
                     aria-label={
                        word.learned ? "Mark as not learned" : "Mark as learned"
                     }
                     className="h-8 w-8 p-0 rounded-full"
                     icon={
                        <Icon
                           name={word.learned ? "CheckCircle" : "PlusCircle"}
                           size={15}
                        />
                     }
                  >
                     <span className="sr-only">
                        {word.learned
                           ? "Mark as not learned"
                           : "Mark as learned"}
                     </span>
                  </Button>
                  <Button
                     variant="primary"
                     size="sm"
                     onClick={() => editWord(word)}
                     aria-label="Edit word"
                     className="h-8 w-8 p-0 rounded-full"
                     icon={<Icon name="Edit" size={15} />}
                  >
                     <span className="sr-only">Edit</span>
                  </Button>
               </div>
            </div>
         </div>
      );
   }
);
