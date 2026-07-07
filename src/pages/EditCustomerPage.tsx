import { useNavigate, useParams } from 'react-router-dom'
import CustomerForm from '../components/CustomerForm'
import type { Customer, CustomerFormData } from '../types/customer'

const MOCK_CUSTOMERS: Customer[] = [
  {
    id: 1,
    name: 'Maria Garcia',
    email: 'maria.garcia@example.com',
    phone: '555-0101',
    address: '742 Evergreen Terrace',
    city: 'Springfield',
    state: 'IL',
    zip: '62704',
  },
  {
    id: 2,
    name: 'James Chen',
    email: 'james.chen@example.com',
    phone: '555-0102',
    address: '1600 Pennsylvania Ave',
    city: 'Washington',
    state: 'DC',
    zip: '20500',
  },
]

function EditCustomerPage() {
  const { id } = useParams()
  const navigate = useNavigate()

  const customerId = Number(id)
  const existingCustomer = MOCK_CUSTOMERS.find((customer) => customer.id === customerId)

  if (!existingCustomer) {
    return (
      <section>
        <h2>Edit Customer</h2>
        <p>Customer not found.</p>
        <button type="button" onClick={() => navigate('/')}>
          Back to Customers
        </button>
      </section>
    )
  }

  const initialData: CustomerFormData = {
    name: existingCustomer.name,
    email: existingCustomer.email,
    phone: existingCustomer.phone,
    address: existingCustomer.address,
    city: existingCustomer.city,
    state: existingCustomer.state,
    zip: existingCustomer.zip,
  }

  const handleSubmit = (formData: CustomerFormData) => {
    // Placeholder for provider/hook update handler.
    void formData
    navigate('/')
  }

  const handleCancel = () => {
    navigate('/')
  }

  return (
    <section>
      <h2>Edit Customer</h2>
      <CustomerForm
        key={existingCustomer.id}
        initialData={initialData}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
      />
    </section>
  )
}

export default EditCustomerPage
