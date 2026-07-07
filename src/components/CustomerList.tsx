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
              <Link className="btn btn--success" to={`/edit/${customer.id}`}>
                Edit
              </Link>
              <button
                type="button"
                className="btn btn--danger"
                onClick={() => onDeleteCustomer(customer.id)}
                aria-label="Delete"
                title="Delete"
              >
                <span aria-hidden="true">🗑</span>
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}

export default CustomerList
