import { Request, Response, NextFunction } from "express";
import { wordsService } from "../services/words.service";
import { CreateWordSchema } from "../../../shared/schemas";
import { z } from "zod";
import { Word } from "../../../shared/types";
import sanitizeHtml from "sanitize-html";

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
            search: sanitizeHtml(String(search)),
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
         const safeId = sanitizeHtml(id);

         const word = await wordsService.getWordById(safeId);

         if (!word) {
            return res.status(404).json({
               error: { message: "Word not found", code: "NOT_FOUND" },
            });
         }

         res.json(word);
      } catch (error) {
         next(error);
      }
   },

   createWord: async (req: Request, res: Response, next: NextFunction) => {
      try {
         // Sanitize HTML before creating new Word
         const sanitizedBody = Object.fromEntries(
            Object.entries(req.body).map(([key, value]) => [
               key,
               typeof value === "string"
                  ? sanitizeHtml(value, {
                       allowedTags: [],
                       allowedAttributes: {},
                       allowVulnerableTags: false,
                    })
                  : value,
            ])
         );

         const validatedData = CreateWordSchema.parse(sanitizedBody);

         const newWord = await wordsService.createWord(validatedData);
         res.status(201).json(newWord);
      } catch (error) {
         const err = error as z.ZodError | Error;
         if (err instanceof z.ZodError || err?.name === "ZodError") {
            return res.status(400).json({
               error: {
                  message: "Validation error",
                  code: "VALIDATION_ERROR",
                  details: err instanceof z.ZodError ? err.errors : [],
               },
            });
         }

         next(error);
      }
   },

   updateWord: async (req: Request, res: Response, next: NextFunction) => {
      try {
         const { id } = req.params;

         // Sanitize HTML before creating new Word
         const safeId = sanitizeHtml(id);
         const sanitizedBody = Object.fromEntries(
            Object.entries(req.body).map(([key, value]) => [
               key,
               typeof value === "string"
                  ? sanitizeHtml(value, {
                       allowedTags: [],
                       allowedAttributes: {},
                       allowVulnerableTags: false,
                    })
                  : value,
            ])
         );

         const validatedData = CreateWordSchema.partial().parse(sanitizedBody);

         const existingWord = await wordsService.getWordById(safeId);
         if (!existingWord) {
            return res.status(404).json({
               error: { message: "Word not found", code: "NOT_FOUND" },
            });
         }

         const updatedWord = await wordsService.updateWord(
            safeId,
            validatedData
         );
         res.json(updatedWord);
      } catch (error) {
         const err = error as z.ZodError | Error;
         if (err instanceof z.ZodError || err?.name === "ZodError") {
            return res.status(400).json({
               error: {
                  message: "Validation error",
                  code: "VALIDATION_ERROR",
                  details: err instanceof z.ZodError ? err.errors : [],
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
