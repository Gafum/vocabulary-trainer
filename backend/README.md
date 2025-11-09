# Vocabulary Trainer Backend

A Node.js TypeScript backend for the Vocabulary Trainer application.

## **Installation**

```bash
npm install
```

## **Start**

```bash
npm run dev
```

> Backend will run at [http://localhost:3000](http://localhost:3000)

## **Tests**

```bash
npm run test
```

## Available Scripts

You can simply start the backend server with:

-  `npm run dev` - Start the development server with hot reload
-  `npm run build` - Build the application for production
-  `npm run start` - Start the production server

### Prisma Commands

-  `npm run prisma:generate` - Generate Prisma client
-  `npm run prisma:migrate` - Run database migrations
-  `npm run prisma:studio` - Open Prisma Studio to manage the database

To get started with Prisma:

1. Run `npm install`
2. Run `npm run prisma:generate`
3. Run `npm run prisma:migrate`

## **Technologies**

-  **Node.js + Express** – server and routing
-  **TypeScript** – type-safe backend logic
-  **Prisma ORM** – database management (SQLite)
-  **Zod** – runtime input validation
-  **dotenv** – environment variable management
-  **Helmet** – security HTTP headers
-  **express-rate-limit** – brute-force protection
-  **sanitize-html** – XSS prevention
-  **Jest + Supertest** – testing framework

## **Features**

-  Create, Read, Update words
-  **Input validation** via Zod schemas
-  **Rate limiting** for basic protection
-  **Error handling middleware** for consistent API responses
-  **Benchmark script** (`benchmark/lookup.ts`) for performance comparison (Map vs Array lookups)

## **Benchmark**

There’s a simple benchmark script that compares **Map lookups** vs **linear search**.

Run it with:

```bash
npm run benchmark
```

It will print execution times for both approaches.

---

## Notes

Add the following environment variables:

```env
DATABASE_URL="file:./prisma/dev.db"
API_KEY="12345"
PORT=3000
CORS_ORIGIN=http://localhost:5173
```

-  **DATABASE_URL** – Path to the SQLite database.
-  **API_KEY** – Your private API key for secure communication between frontend and backend.
-  **PORT** – Port where the API will run (default: 3000).
-  **CORS_ORIGIN** – Allowed origin for frontend requests.

---

## Reflection

The backend focuses on **clarity and maintainability**.
Some trade-offs:

-  No authentication implemented (out of project scope).
-  SQLite used for simplicity instead of PostgreSQL.
-  Only basic rate limiting and sanitization for demonstration purposes.
