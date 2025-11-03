import { PrismaClient } from "@prisma/client";
import type { CreateWordPayload } from "../../../shared/types";

const prisma = new PrismaClient();

export const wordsService = {
   getAllWords: async () => {
      return prisma.word.findMany({
         orderBy: { lastReviewed: "desc" },
      });
   },

   getWordById: async (id: string) => {
      return prisma.word.findUnique({
         where: { id },
      });
   },

   createWord: async (wordData: CreateWordPayload) => {
      return prisma.word.create({
         data: {
            ...wordData,
            lastReviewed: new Date().toISOString(),
         },
      });
   },

   updateWord: async (id: string, wordData: Partial<CreateWordPayload>) => {
      return prisma.word.update({
         where: { id },
         data: {
            ...wordData,
            lastReviewed: new Date().toISOString(),
         },
      });
   },

   deleteWord: async (id: string) => {
      return prisma.word.delete({
         where: { id },
      });
   },

   markAsLearned: async (id: string, learned: boolean) => {
      return prisma.word.update({
         where: { id },
         data: {
            learned,
            lastReviewed: new Date().toISOString(),
         },
      });
   },
};
