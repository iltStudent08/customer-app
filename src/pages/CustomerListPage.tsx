import CustomerList from '../components/CustomerList'
import { useCustomerContext } from '../context/useCustomerContext'
import { useCustomerApi } from '../hooks/useCustomerApi'

function CustomerListPage() {
  const { state } = useCustomerContext()
  const { loading, error, deleteCustomer } = useCustomerApi()

  const handleDeleteCustomer = async (id: number) => {
    await deleteCustomer(id)
  }

  return (
    <section>
      <h2>Customers</h2>
      {loading ? <p>Loading customers...</p> : null}
      {error ? <p role="alert">{error}</p> : null}
      <CustomerList
        customers={state.customers}
        onDeleteCustomer={handleDeleteCustomer}
      />
    </section>
  )
}

export default CustomerListPage
