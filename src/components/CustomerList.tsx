import { Link } from 'react-router-dom'
import type { Customer, CustomerSortField } from '../types/customer'

type CustomerListProps = {
  customers: Customer[]
  onDeleteCustomer: (id: number) => void
  sortField: CustomerSortField | null
  sortOrder: 'asc' | 'desc'
  onSort: (field: CustomerSortField) => void
}

function CustomerList({
  customers,
  onDeleteCustomer,
  sortField,
  sortOrder,
  onSort,
}: CustomerListProps) {
  const handleDeleteClick = (id: number, name: string) => {
    const shouldDelete = window.confirm(
      `Are you sure you want to delete ${name}?`,
    )

    if (!shouldDelete) {
      return
    }

    onDeleteCustomer(id)
  }

  if (customers.length === 0) {
    return <p className="status">No customers found.</p>
  }

  const getSortIndicator = (field: CustomerSortField) => {
    if (sortField !== field) {
      return '↕'
    }

    return sortOrder === 'asc' ? '↑' : '↓'
  }

  return (
    <table className="customer-table">
      <thead>
        <tr>
          <th scope="col">
            <button
              type="button"
              className="table-sort-button"
              onClick={() => onSort('name')}
              aria-label={`Sort by name ${sortField === 'name' && sortOrder === 'asc' ? 'descending' : 'ascending'}`}
            >
              Name <span aria-hidden="true">{getSortIndicator('name')}</span>
            </button>
          </th>
          <th scope="col">
            <button
              type="button"
              className="table-sort-button"
              onClick={() => onSort('email')}
              aria-label={`Sort by email ${sortField === 'email' && sortOrder === 'asc' ? 'descending' : 'ascending'}`}
            >
              Email <span aria-hidden="true">{getSortIndicator('email')}</span>
            </button>
          </th>
          <th scope="col">
            <button
              type="button"
              className="table-sort-button"
              onClick={() => onSort('phone')}
              aria-label={`Sort by phone ${sortField === 'phone' && sortOrder === 'asc' ? 'descending' : 'ascending'}`}
            >
              Phone <span aria-hidden="true">{getSortIndicator('phone')}</span>
            </button>
          </th>
          <th scope="col">
            <button
              type="button"
              className="table-sort-button"
              onClick={() => onSort('city')}
              aria-label={`Sort by city ${sortField === 'city' && sortOrder === 'asc' ? 'descending' : 'ascending'}`}
            >
              City <span aria-hidden="true">{getSortIndicator('city')}</span>
            </button>
          </th>
          <th scope="col">Actions</th>
        </tr>
      </thead>
      <tbody>
        {customers.map((customer) => (
          <tr key={customer.id}>
            <td>{customer.name}</td>
            <td>{customer.email}</td>
            <td>{customer.phone}</td>
            <td>{customer.city}</td>
            <td className="table-actions">
              <Link
                className="btn btn--success"
                to={`/edit/${customer.id}`}
                aria-label={`Edit ${customer.name}`}
                title={`Edit ${customer.name}`}
              >
                <svg
                  className="icon-svg"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    d="M4 20h4l9.6-9.6a1.7 1.7 0 0 0 0-2.4l-1.6-1.6a1.7 1.7 0 0 0-2.4 0L4 16v4Z"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="m12.9 7.1 4 4"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                  />
                </svg>
              </Link>
              <button
                type="button"
                className="btn btn--danger"
                onClick={() => handleDeleteClick(customer.id, customer.name)}
                aria-label={`Delete ${customer.name}`}
                title={`Delete ${customer.name}`}
              >
                <svg
                  className="icon-svg"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    d="M4 7h16M9.5 7V5.5a1 1 0 0 1 1-1h3a1 1 0 0 1 1 1V7m-8 0 1 11a1.5 1.5 0 0 0 1.5 1.4h6a1.5 1.5 0 0 0 1.5-1.4l1-11"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}

export default CustomerList
