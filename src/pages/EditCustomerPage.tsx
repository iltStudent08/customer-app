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
      <section className="page-card">
        <h2>Edit Customer</h2>
        <p className="status">Loading customers...</p>
      </section>
    )
  }

  if (error) {
    return (
      <section className="page-card">
        <h2>Edit Customer</h2>
        <p className="status status--error" role="alert">{error}</p>
        <button type="button" className="btn" onClick={() => navigate('/')}>
          Back to Customers
        </button>
      </section>
    )
  }

  if (isInvalidId || !existingCustomer) {
    return (
      <section className="page-card">
        <h2>Edit Customer</h2>
        <p className="status">Customer not found.</p>
        <button type="button" className="btn" onClick={() => navigate('/')}>
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
    <section className="page-card">
      <h2>Edit Customer</h2>
      {loading ? <p className="status">Loading customers...</p> : null}
      {error ? <p className="status status--error" role="alert">{error}</p> : null}
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
