import { createContext, type Dispatch } from 'react'
import { SAMPLE_CUSTOMERS } from '../data/sampleCustomers'
import type { CustomerAction, CustomerState } from './customerReducer'

export const initialCustomerState: CustomerState = {
  customers: SAMPLE_CUSTOMERS,
}

type CustomerContextValue = {
  state: CustomerState
  dispatch: Dispatch<CustomerAction>
}

export const CustomerContext = createContext<CustomerContextValue | undefined>(
  undefined,
)
