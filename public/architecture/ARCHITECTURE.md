# Customer Manager Architecture

Where will customer state live? — A Context provider wrapping the app, or lifted to a shared parent component?

  I think a context provider wrapping the app is the better approach to me.  I believe that will work more naturally using route based pages that share resources and access.  This way I can avoid as much prop drilling as possible and keep the code cleaner later on.  I will have to be mindful about global scope though and not overfill it with unnecessary stuff.  I will also need to memoize or split context to keep state from rerendering everything when it just needs to rerender specific things.

---------------------------------------------------------------------------------

How will you manage CRUD operations? — useState with helper functions for simplicity, or useReducer with typed actions for scalability?

  I believe it would be smart to go with the useState with helper functions approach for this app.  Since this is just a capstone that has limited scope and I don't intend to grow it very large, it would keep it simple.  However, I would like to practice with useReducer as that seems to be the go forward for my team at work with our new application.

---------------------------------------------------------------------------------

What custom hooks will you need? — A hook for API calls? A hook for CRUD logic?

  I think exposing endpoints via a domain hook i.e. useCustomers that the pages consume will be good and keep http code out of the components.  Then I will also use some smaller service layer to handle the networking requests.

---------------------------------------------------------------------------------

How will the form handle both add and edit modes? — Same component with different props? Or separate components?

  I plan to use a single shared CustomerForm component, and let the Add and Edit pages act as wrappers.  That way the pages themselves will handle the mode and initial data and also be a submission handler.  This way I can keep the ui code seperated per page and have easier mode handling and still allow for some leeway with how the forms will differ from eachother.

---------------------------------------------------------------------------------

## Suggested Component Tree (Based on These Decisions)

```text
App
└─ BrowserRouter (basename = import.meta.env.BASE_URL)
  └─ CustomerProvider
    └─ Routes
      └─ Layout Route
        ├─ Layout
        │  ├─ Header
        │  │  ├─ NavLink: Customers (/)
        │  │  ├─ NavLink: Add Customer (/add)
        │  │  └─ Theme Toggle (light/dark, persisted in localStorage)
        │  └─ Main
        │     └─ ErrorBoundary
        │        └─ Outlet
        ├─ / -> CustomerListPage
        │  └─ CustomerList
        ├─ /add -> AddCustomerPage
        │  └─ CustomerForm (add mode)
        └─ /edit/:id -> EditCustomerPage
           └─ CustomerForm (edit mode)
```

## State and Data Architecture

### Context + Reducer

- Context store is defined in [src/context/customerContextStore.ts](src/context/customerContextStore.ts).
- Reducer and actions are defined in [src/context/customerReducer.ts](src/context/customerReducer.ts).
- Provider is implemented in [src/context/CustomerContext.tsx](src/context/CustomerContext.tsx).
- Consumer hook is [src/context/useCustomerContext.ts](src/context/useCustomerContext.ts).

Reducer actions:

- ADD_CUSTOMER
- UPDATE_CUSTOMER
- DELETE_CUSTOMER
- SET_CUSTOMERS

### Domain Hook

- Main data hook: [src/hooks/useCustomerApi.ts](src/hooks/useCustomerApi.ts).
- Responsibilities:
  - Fetch customers with query options (search, city, sort, pagination).
  - Perform add/update/delete mutations.
  - Keep loading/error/totalCount state.
  - Re-fetch using last query after mutations.

Query options supported:

- search (q)
- city
- sortBy + sortOrder
- page + perPage

### Runtime Modes

1. Server mode (local API available):

- Requests go to /api/customers (proxied by Vite in development).
- Reducer state is hydrated from API responses.

1. Demo fallback mode (API unavailable, e.g. static hosting):

- Hook falls back to [src/data/sampleCustomers.ts](src/data/sampleCustomers.ts).
- Search/sort/pagination are applied locally.
- Add/edit/delete work in-memory for demo purposes.

## UI Behavior

- Shared form component in [src/components/CustomerForm.tsx](src/components/CustomerForm.tsx):
  - Used by add and edit pages.
  - Includes validation and mode-aware submit text.

- List component in [src/components/CustomerList.tsx](src/components/CustomerList.tsx):
  - Sortable columns.
  - Accessible edit/delete actions.
  - Delete confirmation flow.

- List page in [src/pages/CustomerListPage.tsx](src/pages/CustomerListPage.tsx):
  - Search form.
  - Sort state and toggling.
  - Pagination with page-size controls.

- Error boundary in [src/components/ErrorBoundary.tsx](src/components/ErrorBoundary.tsx):
  - Catches rendering errors and provides recovery action.

## Local Development Flow

1. Start API:

```bash
npm run api
```

1. Start frontend:

```bash
npm run dev
```

1. App calls /api/* which Vite proxies to JSON Server.

## Testing Strategy

- Test framework: Vitest + Testing Library.
- Setup: [src/test/setup.ts](src/test/setup.ts).
- Test suites:
  - [src/test/components/CustomerForm.test.tsx](src/test/components/CustomerForm.test.tsx)
  - [src/test/components/CustomerList.test.tsx](src/test/components/CustomerList.test.tsx)
  - [src/test/components/ErrorBoundary.test.tsx](src/test/components/ErrorBoundary.test.tsx)
  - [src/test/pages/CustomerListPage.test.tsx](src/test/pages/CustomerListPage.test.tsx)

Coverage thresholds are configured in [vite.config.ts](vite.config.ts) (minimum 70% for statements, branches, functions, and lines).

## Deployment and CI

- GitHub Actions workflow: [.github/workflows/ci-pages.yml](.github/workflows/ci-pages.yml).
- On pull requests to master:
  - Install
  - Test
  - Build
- On push to master:
  - Install
  - Test
  - Build
  - Upload Pages artifact
  - Deploy to GitHub Pages

GitHub Pages specific details:

- Vite base path is set to /customer-app/.
- BrowserRouter uses basename from import.meta.env.BASE_URL.
- Demo fallback mode allows UI demonstration even when API is not reachable from static hosting.
