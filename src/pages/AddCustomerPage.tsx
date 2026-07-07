import { useNavigate } from 'react-router-dom'
import CustomerForm from '../components/CustomerForm'
import { useCustomerApi } from '../hooks/useCustomerApi'
import type { CustomerFormData } from '../types/customer'

function AddCustomerPage() {
  const navigate = useNavigate()
  const { loading, error, addCustomer } = useCustomerApi()

  const handleSubmit = async (formData: CustomerFormData) => {
    const success = await addCustomer(formData)

    if (success) {
      navigate('/')
    }
  }

  const handleCancel = () => {
    navigate('/')
  }

  return (
    <section>
      <h2>Add Customer</h2>
      {loading ? <p>Loading customers...</p> : null}
      {error ? <p role="alert">{error}</p> : null}
      <CustomerForm onSubmit={handleSubmit} onCancel={handleCancel} />
    </section>
  )
}

export default AddCustomerPage
