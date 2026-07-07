import { useNavigate } from 'react-router-dom'
import CustomerForm from '../components/CustomerForm'
import { CUSTOMER_ACTIONS } from '../context/customerReducer'
import { useCustomerContext } from '../context/useCustomerContext'
import type { CustomerFormData } from '../types/customer'

function AddCustomerPage() {
  const navigate = useNavigate()
  const { state, dispatch } = useCustomerContext()

  const handleSubmit = (formData: CustomerFormData) => {
    const nextId =
      state.customers.length > 0
        ? Math.max(...state.customers.map((customer) => customer.id)) + 1
        : 1

    dispatch({
      type: CUSTOMER_ACTIONS.ADD_CUSTOMER,
      payload: {
        id: nextId,
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
      <h2>Add Customer</h2>
      <CustomerForm onSubmit={handleSubmit} onCancel={handleCancel} />
    </section>
  )
}

export default AddCustomerPage
