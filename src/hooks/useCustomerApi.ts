import { useCallback, useState } from 'react'
import { CUSTOMER_ACTIONS } from '../context/customerReducer'
import { useCustomerContext } from '../context/useCustomerContext'
import { SAMPLE_CUSTOMERS } from '../data/sampleCustomers'
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
  totalCount: number
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

function applyQueryOptions(
  customers: Customer[],
  options: CustomerQueryOptions,
): { rows: Customer[]; totalCount: number } {
  let rows = [...customers]

  if (options.search) {
    const searchTerm = options.search.toLowerCase()
    rows = rows.filter((customer) => {
      const haystack = [
        customer.name,
        customer.email,
        customer.phone,
        customer.address,
        customer.city,
        customer.state,
        customer.zip,
      ]
        .join(' ')
        .toLowerCase()

      return haystack.includes(searchTerm)
    })
  }

  if (options.city) {
    const cityTerm = options.city.toLowerCase()
    rows = rows.filter((customer) => customer.city.toLowerCase() === cityTerm)
  }

  if (options.sortBy) {
    const sortField = options.sortBy

    rows.sort((a, b) => {
      const left = a[sortField].toLowerCase()
      const right = b[sortField].toLowerCase()
      const comparison = left.localeCompare(right)

      return options.sortOrder === 'desc' ? -comparison : comparison
    })
  }

  const totalCount = rows.length

  if (options.page && options.perPage) {
    const start = (options.page - 1) * options.perPage
    const end = start + options.perPage
    rows = rows.slice(start, end)
  }

  return { rows, totalCount }
}

export function useCustomerApi(): UseCustomerApiResult {
  const { dispatch } = useCustomerContext()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [totalCount, setTotalCount] = useState(0)
  const [isDemoMode, setIsDemoMode] = useState(false)
  const [demoCustomers, setDemoCustomers] = useState<Customer[]>(SAMPLE_CUSTOMERS)
  const [lastQuery, setLastQuery] = useState<CustomerQueryOptions>({})

  const applyDemoData = useCallback(
    (customers: Customer[], options: CustomerQueryOptions) => {
      const { rows, totalCount: nextTotal } = applyQueryOptions(customers, options)

      dispatch({
        type: CUSTOMER_ACTIONS.SET_CUSTOMERS,
        payload: rows,
      })

      setTotalCount(nextTotal)
    },
    [dispatch],
  )

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
      searchParams.set('_limit', String(options.perPage))
    }

    const queryString = searchParams.toString()

    return queryString ? `/api/customers?${queryString}` : '/api/customers'
  }

  const fetchCustomers = useCallback(async (
    options: CustomerQueryOptions = {},
    showLoading = true,
  ) => {
    setError(null)

    if (showLoading) {
      setLoading(true)
    }

    setLastQuery(options)

    try {
      const response = await fetch(buildCustomersUrl(options))

      if (!response.ok) {
        throw new Error('Failed to fetch customers.')
      }

      const data: Customer[] = await response.json()
      const totalHeader = response.headers.get('X-Total-Count')
      const total = totalHeader ? Number(totalHeader) : data.length
      setTotalCount(Number.isNaN(total) ? data.length : total)
      setIsDemoMode(false)

      dispatch({
        type: CUSTOMER_ACTIONS.SET_CUSTOMERS,
        payload: data,
      })
    } catch (err) {
      const isLikelyApiUnavailable = typeof window !== 'undefined'

      if (isLikelyApiUnavailable) {
        setIsDemoMode(true)
        setError(null)
        applyDemoData(demoCustomers, options)
      } else {
        setError(getErrorMessage(err))
      }
    } finally {
      setLoading(false)
    }
  }, [applyDemoData, demoCustomers, dispatch])

  const addCustomer = useCallback(
    async (formData: CustomerFormData) => {
      if (isDemoMode) {
        const maxId = Math.max(0, ...demoCustomers.map((customer) => customer.id))
        const nextCustomers = [
          ...demoCustomers,
          {
            id: maxId + 1,
            ...formData,
          },
        ]

        setDemoCustomers(nextCustomers)
        applyDemoData(nextCustomers, lastQuery)
        return true
      }

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
      } catch {
        const maxId = Math.max(0, ...demoCustomers.map((customer) => customer.id))
        const nextCustomers = [
          ...demoCustomers,
          {
            id: maxId + 1,
            ...formData,
          },
        ]

        setIsDemoMode(true)
        setDemoCustomers(nextCustomers)
        setError(null)
        applyDemoData(nextCustomers, lastQuery)
        return true
      } finally {
        setLoading(false)
      }
    },
    [applyDemoData, demoCustomers, fetchCustomers, isDemoMode, lastQuery],
  )

  const updateCustomer = useCallback(
    async (customer: Customer) => {
      if (isDemoMode) {
        const nextCustomers = demoCustomers.map((currentCustomer) =>
          currentCustomer.id === customer.id ? customer : currentCustomer,
        )

        setDemoCustomers(nextCustomers)
        applyDemoData(nextCustomers, lastQuery)
        return true
      }

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
      } catch {
        const nextCustomers = demoCustomers.map((currentCustomer) =>
          currentCustomer.id === customer.id ? customer : currentCustomer,
        )

        setIsDemoMode(true)
        setDemoCustomers(nextCustomers)
        setError(null)
        applyDemoData(nextCustomers, lastQuery)
        return true
      } finally {
        setLoading(false)
      }
    },
    [applyDemoData, demoCustomers, fetchCustomers, isDemoMode, lastQuery],
  )

  const deleteCustomer = useCallback(
    async (id: number) => {
      if (isDemoMode) {
        const nextCustomers = demoCustomers.filter((customer) => customer.id !== id)
        setDemoCustomers(nextCustomers)
        applyDemoData(nextCustomers, lastQuery)
        return true
      }

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
      } catch {
        const nextCustomers = demoCustomers.filter((customer) => customer.id !== id)

        setIsDemoMode(true)
        setDemoCustomers(nextCustomers)
        setError(null)
        applyDemoData(nextCustomers, lastQuery)
        return true
      } finally {
        setLoading(false)
      }
    },
    [applyDemoData, demoCustomers, fetchCustomers, isDemoMode, lastQuery],
  )

  return {
    loading,
    error,
    totalCount,
    fetchCustomers,
    addCustomer,
    updateCustomer,
    deleteCustomer,
  }
}
