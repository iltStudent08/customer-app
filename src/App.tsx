import {
  useEffect,
  useState,
} from 'react'
import {
  BrowserRouter,
  NavLink,
  Outlet,
  Route,
  Routes,
} from 'react-router-dom'
import ErrorBoundary from './components/ErrorBoundary'
import { CustomerProvider } from './context/CustomerContext'
import AddCustomerPage from './pages/AddCustomerPage'
import CustomerListPage from './pages/CustomerListPage'
import EditCustomerPage from './pages/EditCustomerPage'

type ThemeMode = 'light' | 'dark'

function Layout() {
  const [theme, setTheme] = useState<ThemeMode>(() => {
    const savedTheme = localStorage.getItem('theme')
    if (savedTheme === 'light' || savedTheme === 'dark') {
      return savedTheme
    }

    return 'light'
  })

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    localStorage.setItem('theme', theme)
  }, [theme])

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'))
  }

  return (
    <div className="app-shell">
      <header className="app-header">
        <div>
          <p className="eyebrow">CRM Workspace</p>
          <h1>Customer Manager</h1>
        </div>
        <div className="header-actions">
          <nav className="app-nav" aria-label="Primary">
            <NavLink
              to="/"
              className={({ isActive }) =>
                isActive ? 'nav-link nav-link--active' : 'nav-link'
              }
            >
              Customers
            </NavLink>
            <NavLink
              to="/add"
              className={({ isActive }) =>
                isActive ? 'nav-link nav-link--active' : 'nav-link'
              }
            >
              Add Customer
            </NavLink>
          </nav>
          <button
            type="button"
            className="btn btn--icon"
            onClick={toggleTheme}
            aria-label={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
            title={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
          >
            {theme === 'light' ? (
              <svg
                className="icon-svg"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 1 0 9.8 9.8Z"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            ) : (
              <svg
                className="icon-svg"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <circle
                  cx="12"
                  cy="12"
                  r="4"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                />
                <path
                  d="M12 2.5v2.2M12 19.3v2.2M21.5 12h-2.2M4.7 12H2.5M18.7 5.3l-1.6 1.6M6.9 17.1l-1.6 1.6M18.7 18.7l-1.6-1.6M6.9 6.9 5.3 5.3"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                />
              </svg>
            )}
          </button>
        </div>
      </header>

      <main className="app-main">
        <ErrorBoundary>
          <Outlet />
        </ErrorBoundary>
      </main>
    </div>
  )
}

function App() {
  return (
    <BrowserRouter>
      <CustomerProvider>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<CustomerListPage />} />
            <Route path="/add" element={<AddCustomerPage />} />
            <Route path="/edit/:id" element={<EditCustomerPage />} />
          </Route>
        </Routes>
      </CustomerProvider>
    </BrowserRouter>
  )
}

export default App
