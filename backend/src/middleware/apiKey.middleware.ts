import { Request, Response, NextFunction } from "express";

export const apiKeyMiddleware = (
   req: Request,
   res: Response,
   next: NextFunction
) => {
   const apiKey = req.header("X-Api-Key");
   const validApiKey = process.env.API_KEY || "12345";

   if (!apiKey || apiKey !== validApiKey) {
      return res.status(401).json({
         error: {
            message: "Invalid or missing API key",
            code: "UNAUTHORIZED",
         },
      });
   }

   next();
};
