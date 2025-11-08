# Vocabulary Trainer

A small Fullstack TypeScript app built as part of a coding assignment for **NetTrek**.  
It’s a simple vocabulary management tool with search, sorting, and editing features.

## Brief description

The Vocabulary Trainer allows you to create, search, sort, edit and delete new words. All data is stored in a SQLLite database managed via a REST API.

The app consists of two main parts:

-  **Frontend**: React + TypeScript + Vite + TailwindCSS + React Query
-  **Backend**: Node.js + TypeScript + Express + Prisma + SQLLite + Zod

## Quick Start

### Install Dependencies
Before running the project, install all dependencies in **three steps**:

```bash
# Root
npm install

# Backend
cd backend
npm install

# Frontend
cd frontend
npm install
````

---

### Start with VS Code Command Palette

1. Open **Command Palette** → `Ctrl/Command + Shift + P`
2. Type **Run Task**
3. Select **Start Fullstack**

This will launch both the backend and frontend together.

---

### Start Separately (via Terminal)

```bash
cd backend
npm run dev     # API runs at http://localhost:3000

cd frontend
npm run dev     # UI runs at http://localhost:5173
```

---

## Tests

You can run tests in two ways:

```bash
# Run frontend tests from root
npm run test --prefix frontend

# Run backend tests from root
npm run test --prefix backend
```

Or run them inside each folder:

```bash
cd frontend
npm run test

cd backend
npm run test
```

---

## Security & Typing

**Frontend**

* Fully written in **TypeScript** for strong typing.
* **Zod** used for data validation.
* Optimized rendering with **React.memo** and **debounced search**.
* State and server communication handled by **React Query**.

**Backend**

* Input validation via **Zod** to ensure data safety.
* Security middleware:

  * **Helmet** → sets secure HTTP headers
  * **Rate Limiter** → protects against brute-force
  * **sanitize-html** → prevents XSS attacks
* **Prisma ORM** ensures type-safe and reliable DB operations.
* Sensitive configuration managed via **.env** file.

---

## What compromises were consciously made?

* **UI design** was kept simple and functional to focus on logic, structure, and code clarity.
* **Authentication** was intentionally left out.
* **Performance** was improved with simple but effective techniques (debouncing, React.memo, caching) instead of complex solutions like virtualization.


