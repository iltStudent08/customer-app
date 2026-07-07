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
    <section className="page-card">
      <h2>Customers</h2>
      {loading ? <p className="status">Loading customers...</p> : null}
      {error ? <p className="status status--error" role="alert">{error}</p> : null}
      <CustomerList
        customers={state.customers}
        onDeleteCustomer={handleDeleteCustomer}
      />
    </section>
  )
}

export default CustomerListPage
