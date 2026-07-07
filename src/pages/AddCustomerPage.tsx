import { useNavigate } from 'react-router-dom'
import CustomerForm from '../components/CustomerForm'
import type { CustomerFormData } from '../types/customer'

function AddCustomerPage() {
  const navigate = useNavigate()

  const handleSubmit = (formData: CustomerFormData) => {
    // Placeholder for provider/hook create handler.
    void formData
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
