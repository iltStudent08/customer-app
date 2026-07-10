# Customer Manager App

Live App: https://iltStudent08.github.io/customer-app/

Customer Manager is a React + TypeScript single-page app for managing customer records with search, sorting, pagination, and CRUD flows.

## Features

- Customer list view with searchable, sortable columns.
- Pagination controls with page-size options.
- Add, edit, and delete customer flows.
- Form validation and accessibility-focused labels/actions.
- Error boundary for resilient UI fallback.
- Demo fallback data mode when API is unavailable (useful for GitHub Pages demo).
- Test suite with coverage thresholds.

## Tech Stack

- React 19
- TypeScript
- Vite
- React Router
- Context + useReducer state management
- JSON Server (local API)
- Vitest + Testing Library

## Project Structure

- [src/components](src/components): Reusable UI components.
- [src/pages](src/pages): Route-level page components.
- [src/context](src/context): App state context and reducer.
- [src/hooks](src/hooks): Data-fetching and API integration hooks.
- [src/test](src/test): Test setup and component/page tests.
- [db.json](db.json): Local JSON Server data source.

## Getting Started

### Prerequisites

- Node.js 20+
- npm

### Install

```bash
npm install
```

### Run the App Locally

1. Start the API server (port 3001) in the first terminal:

```bash
npm run api
```

2. Start the Vite frontend server in a second terminal:

```bash
npm run dev
```

3. Open the local app:

- Frontend: http://localhost:5173
- API endpoint: http://localhost:3001/customers

## Scripts

- npm run dev: Start Vite dev server.
- npm run api: Start local JSON Server API.
- npm run build: Type-check and build production bundle.
- npm run preview: Preview production build locally.
- npm run test: Start Vitest in interactive mode.
- npm run test:run: Run tests once.
- npm run test:coverage: Run tests with coverage report.

## Testing and Quality

- Coverage thresholds are configured in [vite.config.ts](vite.config.ts) (minimum 70% for lines/functions/branches/statements).
- Run full tests:

```bash
npm run test:run
```

- Run coverage:

```bash
npm run test:coverage
```

## Deployment Notes

- The app is configured for GitHub Pages using the base path /customer-app/.
- GitHub Actions workflow is located at [.github/workflows/ci-pages.yml](.github/workflows/ci-pages.yml).
- In static hosting environments, API endpoints may be unavailable; the app can fall back to demo sample data.

## Repository

- Owner: iltStudent08
- Repo: customer-app
