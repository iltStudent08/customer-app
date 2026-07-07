import { useCallback, useEffect, useState } from 'react'
import { CUSTOMER_ACTIONS } from '../context/customerReducer'
import { useCustomerContext } from '../context/useCustomerContext'
import type { Customer, CustomerFormData } from '../types/customer'

type UseCustomerApiResult = {
  loading: boolean
  error: string | null
  fetchCustomers: () => Promise<void>
  addCustomer: (formData: CustomerFormData) => Promise<boolean>
  updateCustomer: (customer: Customer) => Promise<boolean>
  deleteCustomer: (id: number) => Promise<boolean>
}

function getErrorMessage(error: unknown) {
  if (error instanceof Error) {
    return error.message
  }

  return 'Something went wrong while talking to the server.'
}

export function useCustomerApi(): UseCustomerApiResult {
  const { dispatch } = useCustomerContext()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchCustomers = useCallback(async (showLoading = true) => {
    if (showLoading) {
      setLoading(true)
      setError(null)
    }

    try {
      const response = await fetch('/api/customers')

      if (!response.ok) {
        throw new Error('Failed to fetch customers.')
      }

      const data: Customer[] = await response.json()

      dispatch({
        type: CUSTOMER_ACTIONS.SET_CUSTOMERS,
        payload: data,
      })
    } catch (err) {
      setError(getErrorMessage(err))
    } finally {
      setLoading(false)
    }
  }, [dispatch])

  useEffect(() => {
    const timerId = window.setTimeout(() => {
      void fetchCustomers(false)
    }, 0)

    return () => {
      window.clearTimeout(timerId)
    }
  }, [fetchCustomers])

  const addCustomer = useCallback(
    async (formData: CustomerFormData) => {
      setLoading(true)
      setError(null)

      try {
        const response = await fetch('/api/customers', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        })

        if (!response.ok) {
          throw new Error('Failed to add customer.')
        }

        await fetchCustomers(false)
        return true
      } catch (err) {
        setError(getErrorMessage(err))
        setLoading(false)
        return false
      }
    },
    [fetchCustomers],
  )

  const updateCustomer = useCallback(
    async (customer: Customer) => {
      setLoading(true)
      setError(null)

      try {
        const response = await fetch(`/api/customers/${customer.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(customer),
        })

        if (!response.ok) {
          throw new Error('Failed to update customer.')
        }

        await fetchCustomers(false)
        return true
      } catch (err) {
        setError(getErrorMessage(err))
        setLoading(false)
        return false
      }
    },
    [fetchCustomers],
  )

  const deleteCustomer = useCallback(
    async (id: number) => {
      setLoading(true)
      setError(null)

      try {
        const response = await fetch(`/api/customers/${id}`, {
          method: 'DELETE',
        })

        if (!response.ok) {
          throw new Error('Failed to delete customer.')
        }

        await fetchCustomers(false)
        return true
      } catch (err) {
        setError(getErrorMessage(err))
        setLoading(false)
        return false
      }
    },
    [fetchCustomers],
  )

  return {
    loading,
    error,
    fetchCustomers,
    addCustomer,
    updateCustomer,
    deleteCustomer,
  }
}
