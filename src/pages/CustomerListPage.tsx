import CustomerList from '../components/CustomerList'
import { CUSTOMER_ACTIONS } from '../context/customerReducer'
import { useCustomerContext } from '../context/useCustomerContext'

function CustomerListPage() {
  const { state, dispatch } = useCustomerContext()

  const handleDeleteCustomer = (id: number) => {
    dispatch({
      type: CUSTOMER_ACTIONS.DELETE_CUSTOMER,
      payload: id,
    })
  }

  return (
    <section>
      <h2>Customers</h2>
      <CustomerList
        customers={state.customers}
        onDeleteCustomer={handleDeleteCustomer}
      />
    </section>
  )
}

export default CustomerListPage
