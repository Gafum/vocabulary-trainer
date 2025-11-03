import { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";
import { logger } from "../utils/logger";

export const errorMiddleware = (
   err: Error,
   req: Request,
   res: Response,
   next: NextFunction
) => {
   logger.error(`Error: ${err.message}`);

   // Handle Zod validation errors
   if (err instanceof ZodError) {
      return res.status(400).json({
         error: {
            message: "Validation error",
            code: "VALIDATION_ERROR",
            details: err.errors,
         },
      });
   }

   // Handle Prisma errors
   if (err.name === "PrismaClientKnownRequestError") {
      return res.status(400).json({
         error: {
            message: "Database error",
            code: "DATABASE_ERROR",
            details: err.message,
         },
      });
   }

   // Default error handler
   return res.status(500).json({
      error: {
         message: "Internal server error",
         code: "INTERNAL_SERVER_ERROR",
      },
   });
};
