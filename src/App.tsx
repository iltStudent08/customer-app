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
            className="btn btn--secondary"
            onClick={toggleTheme}
          >
            {theme === 'light' ? 'Dark mode' : 'Light mode'}
          </button>
        </div>
      </header>

      <main className="app-main">
        <Outlet />
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
