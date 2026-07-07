import { useEffect, useState } from 'react'
import CustomerList from '../components/CustomerList'
import { useCustomerContext } from '../context/useCustomerContext'
import { useCustomerApi } from '../hooks/useCustomerApi'
import type { CustomerSortField } from '../types/customer'

function CustomerListPage() {
  const { state } = useCustomerContext()
  const { loading, error, totalCount, deleteCustomer, fetchCustomers } = useCustomerApi()
  const [searchInput, setSearchInput] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [sortField, setSortField] = useState<CustomerSortField | null>(null)
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc')
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)

  useEffect(() => {
    void fetchCustomers(
      {
        search: searchTerm || undefined,
        sortBy: sortField ?? undefined,
        sortOrder: sortField ? sortOrder : undefined,
        page: currentPage,
        perPage: pageSize,
      },
      false,
    )
  }, [currentPage, fetchCustomers, pageSize, searchTerm, sortField, sortOrder])

  const handleDeleteCustomer = async (id: number) => {
    await deleteCustomer(id)
  }

  const handleSearchSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setSearchTerm(searchInput.trim())
    setCurrentPage(1)
  }

  const handleClearSearch = () => {
    setSearchInput('')
    setSearchTerm('')
    setCurrentPage(1)
  }

  const handleSort = (field: CustomerSortField) => {
    if (sortField === field) {
      setSortOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'))
      return
    }

    setSortField(field)
    setSortOrder('asc')
    setCurrentPage(1)
  }

  const handlePageSizeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setPageSize(Number(event.target.value))
    setCurrentPage(1)
  }

  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize))
  const canGoBack = currentPage > 1
  const canGoNext = currentPage < totalPages

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
      <div className="pagination-bar">
        <p className="pagination-summary">
          Page {currentPage} of {totalPages} ({totalCount} records)
        </p>
        <div className="pagination-actions">
          <button
            type="button"
            className="btn"
            onClick={() => setCurrentPage((prev) => prev - 1)}
            disabled={!canGoBack}
          >
            Previous
          </button>
          <button
            type="button"
            className="btn"
            onClick={() => setCurrentPage((prev) => prev + 1)}
            disabled={!canGoNext}
          >
            Next
          </button>
          <label className="pagination-size" htmlFor="page-size-select">
            Rows per page
          </label>
          <select
            id="page-size-select"
            className="form-input pagination-select"
            value={pageSize}
            onChange={handlePageSizeChange}
          >
            <option value={10}>10</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
          </select>
        </div>
      </div>
    </section>
  )
}

export default CustomerListPage
