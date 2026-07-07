import {
  BrowserRouter,
  NavLink,
  Outlet,
  Route,
  Routes,
} from 'react-router-dom'
import { CustomerProvider } from './context/CustomerContext'
import AddCustomerPage from './pages/AddCustomerPage'
import EditCustomerPage from './pages/EditCustomerPage'

function Layout() {
  return (
    <div
      style={{
        maxWidth: '960px',
        margin: '0 auto',
        padding: '1rem',
        fontFamily: 'system-ui, -apple-system, Segoe UI, Roboto, sans-serif',
      }}
    >
      <header
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '1rem',
          marginBottom: '1.25rem',
          padding: '0.75rem 1rem',
          border: '1px solid #cfcfcf',
          borderRadius: '8px',
          backgroundColor: '#f8f8f8',
        }}
      >
        <h1 style={{ margin: 0, fontSize: '1.25rem' }}>Customer Manager</h1>
        <nav style={{ display: 'flex', gap: '0.75rem' }}>
          <NavLink to="/">Customers</NavLink>
          <NavLink to="/add">Add Customer</NavLink>
        </nav>
      </header>

      <main>
        <Outlet />
      </main>
    </div>
  )
}

function CustomerListPage() {
  return <h1>Customer list page</h1>
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
