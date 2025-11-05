import request from "supertest";
import { app } from "../src/app";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const API_KEY = process.env.API_KEY || "12345";

beforeAll(async () => {
   // Clear test database before tests
   await prisma.word.deleteMany({});
});

afterAll(async () => {
   await prisma.$disconnect();
});

describe("Words API", () => {
   let wordId: string;

   test("POST /api/words - should create a new word", async () => {
      const response = await request(app)
         .post("/api/words")
         .set("X-Api-Key", API_KEY)
         .send({
            term: "Haus",
            translation: "house",
            difficulty: 2,
         });

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty("id");
      expect(response.body.term).toBe("Haus");
      expect(response.body.translation).toBe("house");
      expect(response.body.difficulty).toBe(2);

      wordId = response.body.id;
   });

   test("POST /api/words - should return 400 for invalid payload", async () => {
      const response = await request(app)
         .post("/api/words")
         .set("X-Api-Key", API_KEY)
         .send({
            term: "", // Invalid: empty string
            translation: "house",
            difficulty: 10, // Invalid: out of range
         });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty("error");
      expect(response.body.error).toHaveProperty("message", "Validation error");
   });

   test("GET /api/words - should return all words", async () => {
      const response = await request(app)
         .get("/api/words")
         .set("X-Api-Key", API_KEY);

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body.data)).toBe(true); // перевіряємо масив всередині data
      expect(response.body.data.length).toBeGreaterThan(0);
   });

   test("GET /api/words/:id - should return a specific word", async () => {
      const response = await request(app)
         .get(`/api/words/${wordId}`)
         .set("X-Api-Key", API_KEY);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("id", wordId);
      expect(response.body.term).toBe("Haus");
   });

   test("PUT /api/words/:id - should update a word", async () => {
      const response = await request(app)
         .put(`/api/words/${wordId}`)
         .set("X-Api-Key", API_KEY)
         .send({
            difficulty: 3,
            learned: true,
         });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("id", wordId);
      expect(response.body.difficulty).toBe(3);
      expect(response.body.learned).toBe(true);
   });
});
