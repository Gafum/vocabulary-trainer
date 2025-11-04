import { Request, Response, NextFunction } from "express";
import { wordsService } from "../services/words.service";
import { CreateWordSchema, UpdateWordSchema } from "../../../shared/schemas";
import { z } from "zod";
import { Word } from "../../../shared/types";

export const wordsController = {
   getAllWords: async (req: Request, res: Response, next: NextFunction) => {
      try {
         const {
            page = 1,
            limit = 10,
            search = "",
            sortBy = "term",
            order = "asc",
         } = req.query;

         const result = await wordsService.getAllWords({
            page: Number(page),
            limit: Number(limit),
            search: String(search),
            sortBy: String(sortBy) as keyof Word,
            order: order === "desc" ? "desc" : "asc",
         });

         res.json(result);
      } catch (error) {
         next(error);
      }
   },

   getWordById: async (req: Request, res: Response, next: NextFunction) => {
      try {
         const { id } = req.params;
         const word = await wordsService.getWordById(id);

         if (!word) {
            return res.status(404).json({
               error: {
                  message: "Word not found",
                  code: "NOT_FOUND",
               },
            });
         }

         res.json(word);
      } catch (error) {
         next(error);
      }
   },

   createWord: async (req: Request, res: Response, next: NextFunction) => {
      try {
         const validatedData = CreateWordSchema.parse(req.body);
         const newWord = await wordsService.createWord(validatedData);
         res.status(201).json(newWord);
      } catch (error) {
         if (error instanceof z.ZodError) {
            return res.status(400).json({
               error: {
                  message: "Validation error",
                  code: "VALIDATION_ERROR",
                  details: error.errors,
               },
            });
         }
         next(error);
      }
   },

   updateWord: async (req: Request, res: Response, next: NextFunction) => {
      try {
         const { id } = req.params;
         const validatedData = UpdateWordSchema.parse(req.body);

         const existingWord = await wordsService.getWordById(id);
         if (!existingWord) {
            return res.status(404).json({
               error: {
                  message: "Word not found",
                  code: "NOT_FOUND",
               },
            });
         }

         const updatedWord = await wordsService.updateWord(id, validatedData);
         res.json(updatedWord);
      } catch (error) {
         if (error instanceof z.ZodError) {
            return res.status(400).json({
               error: {
                  message: "Validation error",
                  code: "VALIDATION_ERROR",
                  details: error.errors,
               },
            });
         }
         next(error);
      }
   },

   // Dont need for task
   // deleteWord: async (req: Request, res: Response, next: NextFunction) => {
   //    try {
   //       const { id } = req.params;

   //       const existingWord = await wordsService.getWordById(id);
   //       if (!existingWord) {
   //          return res.status(404).json({
   //             error: {
   //                message: "Word not found",
   //                code: "NOT_FOUND",
   //             },
   //          });
   //       }

   //       await wordsService.deleteWord(id);
   //       return res.status(204).send();
   //    } catch (error) {
   //       next(error);
   //    }
   // },
};
