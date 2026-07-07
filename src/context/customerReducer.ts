import type { Customer } from '../types/customer'

export const CUSTOMER_ACTIONS = {
  ADD_CUSTOMER: 'ADD_CUSTOMER',
  UPDATE_CUSTOMER: 'UPDATE_CUSTOMER',
  DELETE_CUSTOMER: 'DELETE_CUSTOMER',
  SET_CUSTOMERS: 'SET_CUSTOMERS',
} as const

export type CustomerState = {
  customers: Customer[]
}

type AddCustomerAction = {
  type: typeof CUSTOMER_ACTIONS.ADD_CUSTOMER
  payload: Customer
}

type UpdateCustomerAction = {
  type: typeof CUSTOMER_ACTIONS.UPDATE_CUSTOMER
  payload: Customer
}

type DeleteCustomerAction = {
  type: typeof CUSTOMER_ACTIONS.DELETE_CUSTOMER
  payload: number
}

type SetCustomersAction = {
  type: typeof CUSTOMER_ACTIONS.SET_CUSTOMERS
  payload: Customer[]
}

export type CustomerAction =
  | AddCustomerAction
  | UpdateCustomerAction
  | DeleteCustomerAction
  | SetCustomersAction

export function customerReducer(
  state: CustomerState,
  action: CustomerAction,
): CustomerState {
  switch (action.type) {
    case CUSTOMER_ACTIONS.ADD_CUSTOMER:
      return {
        ...state,
        customers: [...state.customers, action.payload],
      }

    case CUSTOMER_ACTIONS.UPDATE_CUSTOMER:
      return {
        ...state,
        customers: state.customers.map((customer) =>
          customer.id === action.payload.id ? action.payload : customer,
        ),
      }

    case CUSTOMER_ACTIONS.DELETE_CUSTOMER:
      return {
        ...state,
        customers: state.customers.filter(
          (customer) => customer.id !== action.payload,
        ),
      }

    case CUSTOMER_ACTIONS.SET_CUSTOMERS:
      return {
        ...state,
        customers: action.payload,
      }

    default:
      return state
  }
}
