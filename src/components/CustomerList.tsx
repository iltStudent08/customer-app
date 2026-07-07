import { Link } from 'react-router-dom'
import type { Customer } from '../types/customer'

type CustomerListProps = {
  customers: Customer[]
  onDeleteCustomer: (id: number) => void
}

function CustomerList({ customers, onDeleteCustomer }: CustomerListProps) {
  if (customers.length === 0) {
    return <p className="status">No customers found.</p>
  }

  return (
    <table className="customer-table">
      <thead>
        <tr>
          <th scope="col">Name</th>
          <th scope="col">Email</th>
          <th scope="col">Phone</th>
          <th scope="col">City</th>
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
                aria-label="Edit"
                title="Edit"
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
                onClick={() => onDeleteCustomer(customer.id)}
                aria-label="Delete"
                title="Delete"
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
