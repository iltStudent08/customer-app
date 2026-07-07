import { useCallback, useEffect, useState } from 'react'
import { CUSTOMER_ACTIONS } from '../context/customerReducer'
import { useCustomerContext } from '../context/useCustomerContext'
import type {
  Customer,
  CustomerFormData,
  CustomerSortField,
} from '../types/customer'

type CustomerQueryOptions = {
  search?: string
  city?: string
  sortBy?: CustomerSortField
  sortOrder?: 'asc' | 'desc'
  page?: number
  perPage?: number
}

type UseCustomerApiResult = {
  loading: boolean
  error: string | null
  fetchCustomers: (
    options?: CustomerQueryOptions,
    showLoading?: boolean,
  ) => Promise<void>
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
  const [lastQuery, setLastQuery] = useState<CustomerQueryOptions>({})

  const buildCustomersUrl = (options: CustomerQueryOptions = {}) => {
    const searchParams = new URLSearchParams()

    if (options.search) {
      searchParams.set('q', options.search)
    }

    if (options.city) {
      searchParams.set('city', options.city)
    }

    if (options.sortBy) {
      searchParams.set('_sort', options.sortBy)
      searchParams.set('_order', options.sortOrder ?? 'asc')
    }

    if (options.page) {
      searchParams.set('_page', String(options.page))
    }

    if (options.perPage) {
      searchParams.set('_per_page', String(options.perPage))
    }

    const queryString = searchParams.toString()

    return queryString ? `/api/customers?${queryString}` : '/api/customers'
  }

  const fetchCustomers = useCallback(async (
    options: CustomerQueryOptions = {},
    showLoading = true,
  ) => {
    if (showLoading) {
      setLoading(true)
      setError(null)
    }

    setLastQuery(options)

    try {
      const response = await fetch(buildCustomersUrl(options))

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
      void fetchCustomers({}, false)
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

        await fetchCustomers(lastQuery, false)
        return true
      } catch (err) {
        setError(getErrorMessage(err))
        setLoading(false)
        return false
      }
    },
    [fetchCustomers, lastQuery],
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

        await fetchCustomers(lastQuery, false)
        return true
      } catch (err) {
        setError(getErrorMessage(err))
        setLoading(false)
        return false
      }
    },
    [fetchCustomers, lastQuery],
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

        await fetchCustomers(lastQuery, false)
        return true
      } catch (err) {
        setError(getErrorMessage(err))
        setLoading(false)
        return false
      }
    },
    [fetchCustomers, lastQuery],
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
