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
└─ BrowserRouter
  └─ CustomerProvider (Context)
    └─ Layout
      ├─ Header
      │  ├─ NavLink: Customers (/)
      │  └─ NavLink: Add Customer (/add)
      └─ Main
        └─ Routes
          ├─ / -> CustomerListPage
          │  └─ CustomerList
          │     └─ CustomerCard (repeated)
          ├─ /add -> AddCustomerPage
          │  └─ CustomerForm (mode="add")
          └─ /edit/:id -> EditCustomerPage
            └─ CustomerForm (mode="edit", initialValues=customer)
```

## Hook + Service Layer Placement

- useCustomers (domain hook): consumed by CustomerListPage, AddCustomerPage, EditCustomerPage.
- customerService (network layer): called inside context/provider or hook helpers for API requests.

## Data Flow Notes

- CustomerProvider owns customer state and CRUD helper functions.
- useCustomers exposes state + operations to pages without leaking HTTP details.
- AddCustomerPage and EditCustomerPage are wrappers that pass mode/initial values/submit handlers into the shared CustomerForm.

## Git Branching Strategy

- Keep `master` stable and merge only reviewed, working changes.
- Create short-lived branches from `master` for each feature, fix, or chore.
- Open small PRs and squash-merge back into `master`.
- Delete merged branches to keep history and branch list clean.

### Branch Naming

- `feature/<scope>-<name>`
  Example: `feature/pages-customer-list`
- `fix/<scope>-<name>`
  Example: `fix/form-submit-validation`
- `chore/<scope>-<name>`
  Example: `chore/eslint-config`

### Commit Style

- Use focused commits by logical unit (types, component, page wiring, tests).
- Use conventional prefixes:
  - `feat: add customer list page`
  - `fix: handle empty customer name`
  - `chore: clean lint warnings`
  - `test: add customer form tests`

### PR Workflow

1. Pull latest `master`.
2. Create branch from `master`.
3. Commit in small steps.
4. Push branch and open PR (draft is fine early).
5. Re-sync with `master` before final review.
6. Squash-merge to `master`.
7. Delete branch.

### Practical Rule For This Project

- One branch per feature area (page/component/hook), with multiple focused commits inside that branch.
- Avoid mixing unrelated work in the same PR.
