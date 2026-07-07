import { useEffect, useState } from 'react'
import CustomerList from '../components/CustomerList'
import { useCustomerContext } from '../context/useCustomerContext'
import { useCustomerApi } from '../hooks/useCustomerApi'
import type { CustomerSortField } from '../types/customer'

function CustomerListPage() {
  const { state } = useCustomerContext()
  const { loading, error, deleteCustomer, fetchCustomers } = useCustomerApi()
  const [searchInput, setSearchInput] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [sortField, setSortField] = useState<CustomerSortField | null>(null)
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc')

  useEffect(() => {
    void fetchCustomers(
      {
        search: searchTerm || undefined,
        sortBy: sortField ?? undefined,
        sortOrder: sortField ? sortOrder : undefined,
      },
      false,
    )
  }, [fetchCustomers, searchTerm, sortField, sortOrder])

  const handleDeleteCustomer = async (id: number) => {
    await deleteCustomer(id)
  }

  const handleSearchSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setSearchTerm(searchInput.trim())
  }

  const handleClearSearch = () => {
    setSearchInput('')
    setSearchTerm('')
  }

  const handleSort = (field: CustomerSortField) => {
    if (sortField === field) {
      setSortOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'))
      return
    }

    setSortField(field)
    setSortOrder('asc')
  }

  return (
    <section className="page-card">
      <h2>Customers</h2>
      <form className="search-bar" onSubmit={handleSearchSubmit}>
        <label htmlFor="customer-search" className="search-label">
          Search customers
        </label>
        <input
          id="customer-search"
          type="search"
          className="form-input"
          placeholder="Search by name, city, email..."
          value={searchInput}
          onChange={(event) => setSearchInput(event.target.value)}
        />
        <button type="submit" className="btn btn--primary">
          Search
        </button>
        <button
          type="button"
          className="btn"
          onClick={handleClearSearch}
        >
          Clear
        </button>
      </form>
      {loading ? <p className="status">Loading customers...</p> : null}
      {error ? <p className="status status--error" role="alert">{error}</p> : null}
      <CustomerList
        customers={state.customers}
        onDeleteCustomer={handleDeleteCustomer}
        sortField={sortField}
        sortOrder={sortOrder}
        onSort={handleSort}
      />
    </section>
  )
}

export default CustomerListPage
