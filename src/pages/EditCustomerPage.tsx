import { useNavigate, useParams } from 'react-router-dom'
import CustomerForm from '../components/CustomerForm'
import { CUSTOMER_ACTIONS } from '../context/customerReducer'
import { useCustomerContext } from '../context/useCustomerContext'
import type { CustomerFormData } from '../types/customer'

function EditCustomerPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { state, dispatch } = useCustomerContext()

  const customerId = Number(id)
  const isInvalidId = Number.isNaN(customerId)
  const existingCustomer = state.customers.find(
    (customer) => customer.id === customerId,
  )

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

  const handleSubmit = (formData: CustomerFormData) => {
    dispatch({
      type: CUSTOMER_ACTIONS.UPDATE_CUSTOMER,
      payload: {
        id: existingCustomer.id,
        ...formData,
      },
    })

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
