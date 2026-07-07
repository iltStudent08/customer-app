import { useNavigate, useParams } from 'react-router-dom'
import CustomerForm from '../components/CustomerForm'
import { useCustomerContext } from '../context/useCustomerContext'
import { useCustomerApi } from '../hooks/useCustomerApi'
import type { CustomerFormData } from '../types/customer'

function EditCustomerPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { state } = useCustomerContext()
  const { loading, error, updateCustomer } = useCustomerApi()

  const customerId = Number(id)
  const isInvalidId = Number.isNaN(customerId)
  const existingCustomer = state.customers.find(
    (customer) => customer.id === customerId,
  )

  if (loading) {
    return (
      <section>
        <h2>Edit Customer</h2>
        <p>Loading customers...</p>
      </section>
    )
  }

  if (error) {
    return (
      <section>
        <h2>Edit Customer</h2>
        <p role="alert">{error}</p>
        <button type="button" onClick={() => navigate('/')}>
          Back to Customers
        </button>
      </section>
    )
  }

  if (isInvalidId || !existingCustomer) {
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

  const handleSubmit = async (formData: CustomerFormData) => {
    const success = await updateCustomer({
      id: existingCustomer.id,
      ...formData,
    })

    if (success) {
      navigate('/')
    }
  }

  const handleCancel = () => {
    navigate('/')
  }

  return (
    <section>
      <h2>Edit Customer</h2>
      {loading ? <p>Loading customers...</p> : null}
      {error ? <p role="alert">{error}</p> : null}
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
