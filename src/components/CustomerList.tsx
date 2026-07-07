import { Link } from 'react-router-dom'
import type { Customer } from '../types/customer'

type CustomerListProps = {
  customers: Customer[]
  onDeleteCustomer: (id: number) => void
}

function CustomerList({ customers, onDeleteCustomer }: CustomerListProps) {
  if (customers.length === 0) {
    return <p>No customers found.</p>
  }

  return (
    <table>
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
            <td>
              <Link to={`/edit/${customer.id}`}>Edit</Link>{' '}
              <button
                type="button"
                onClick={() => onDeleteCustomer(customer.id)}
              >
                Delete
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}

export default CustomerList
