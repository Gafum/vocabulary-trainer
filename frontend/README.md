# Vocabulary Trainer Frontend

A React TypeScript frontend for the Vocabulary Trainer application.

## **Installation**

```bash
npm install
```

## **Start**

```bash
npm run dev
```

> Frontend will be available at [http://localhost:5173](http://localhost:5173)

## **Tests**

```bash
npm run test
```

## **Technologies**

-  **React 18** – component-based UI framework
-  **TypeScript** – strong typing and better developer experience
-  **Vite** – fast development server and optimized builds
-  **React Router DOM** – client-side navigation
-  **React Query** – server-state management and caching
-  **TailwindCSS** – styling framework
-  **Lucide React** – icons
-  **Axios** – HTTP client for API requests
-  **Vitest + Testing Library** – testing setup

## **Notes**

Add the following environment variables:

```env
VITE_API_BASE_URL=http://localhost:3000
VITE_API_KEY=12345
```

-  **VITE_API_URL** – URL to the backend API.
-  **VITE_API_KEY** – Must match the backend API key for authorization.

## **Reflexion**

The current frontend implementation focuses on a clean, simple structure with TypeScript and React hooks.
In the future, the project could be enhanced by:

-  Adding **state management** (e.g., Redux or Zustand) to better handle global state.
-  Implementing a **user registration/login page** with proper authentication flow.
-  Using **React Hook Form** for more precise and scalable form validation.
-  Writing **more comprehensive tests**, including edge cases and integration tests, to improve reliability and maintainability.
-  Adding animation and transition effects to improve user experience.
