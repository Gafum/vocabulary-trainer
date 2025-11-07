import express from "express";
import helmet from "helmet";
import cors from "cors";
import { config } from "dotenv";
import { apiKeyMiddleware } from "./middleware/apiKey.middleware";
import { errorMiddleware } from "./middleware/error.middleware";
import { rateLimitMiddleware } from "./middleware/rateLimit.middleware";
import { wordsRoutes } from "./routes/words.routes";

config();
const app = express();

// Middleware
app.use(helmet());
app.use(cors({
  origin: (process.env.CORS_ORIGIN || "http://localhost:5173").split(","),
  credentials: true,
}));
app.use(express.json());
app.use(rateLimitMiddleware);

// API routes
app.use("/api/words", apiKeyMiddleware, wordsRoutes);

// Check if server is running
app.get("/health", (req: express.Request, res: express.Response) => {
  res.status(200).json({ status: "ok" });
});

// Error handling
app.use(errorMiddleware);

// 404 handler
app.use((req: express.Request, res: express.Response) => {
  res.status(404).json({
    error: {
      message: "Not found",
      code: "NOT_FOUND",
    },
  });
});

export { app };
