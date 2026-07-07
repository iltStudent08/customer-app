import {
  useReducer,
  type ReactNode,
} from 'react'
import {
  CustomerContext,
  initialCustomerState,
} from './customerContextStore.ts'
import { customerReducer } from './customerReducer.ts'

type CustomerProviderProps = {
  children: ReactNode
}

export function CustomerProvider({ children }: CustomerProviderProps) {
  const [state, dispatch] = useReducer(customerReducer, initialCustomerState)

  return (
    <CustomerContext.Provider value={{ state, dispatch }}>
      {children}
    </CustomerContext.Provider>
  )
}
