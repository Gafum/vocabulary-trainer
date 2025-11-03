import { Router } from "express";
import { wordsController } from "../controllers/words.controller";

const router = Router();

router.get("/", wordsController.getAllWords);
router.get("/:id", wordsController.getWordById);
router.post("/", wordsController.createWord);
router.put("/:id", wordsController.updateWord);

export const wordsRoutes = router;
