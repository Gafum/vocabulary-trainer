import { PrismaClient } from "@prisma/client";
import type {
   CreateWordPayload,
   FetchWordsQueryParams,
} from "../../../shared/types";

const prisma = new PrismaClient();

export const wordsService = {
   getAllWords: async ({
      page,
      limit,
      search,
      sortBy,
      order,
   }: Required<FetchWordsQueryParams>) => {
      const skip = (page - 1) * limit;

      const where = search
         ? {
              OR: [
                 { term: { contains: search } },
                 { translation: { contains: search } },
              ],
           }
         : {};

      const totalCount = await prisma.word.count({ where });

      const words = await prisma.word.findMany({
         where,
         orderBy: { [sortBy]: order },
         skip,
         take: limit,
      });

      const totalPages = Math.ceil(totalCount / limit);

      return {
         data: words,
         page,
         totalPages,
      };
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

   // Dont need for task
   // deleteWord: async (id: string) => {
   //    return prisma.word.delete({
   //       where: { id },
   //    });
   // },
};
