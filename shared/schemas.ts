import { z } from "zod";

export const WordSchema = z.object({
   id: z.string().uuid(),
   term: z.string().min(1, "Term is required"),
   translation: z.string().min(1, "Translation is required"),
   lastReviewed: z.string().datetime(),
   difficulty: z.number().int().min(1).max(5),
   learned: z.boolean().optional(),
});

export const CreateWordSchema = z.object({
   term: z.string().min(1, { message: "Term is required" }),
   translation: z.string().min(1, { message: "Translation is required" }),
   difficulty: z.number().min(1).max(5),
   learned: z.boolean().optional(),
});
