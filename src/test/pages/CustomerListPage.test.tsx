import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import CustomerListPage from '../../pages/CustomerListPage'
import type { Customer } from '../../types/customer'

const mockUseCustomerContext = vi.hoisted(() => vi.fn())
const mockUseCustomerApi = vi.hoisted(() => vi.fn())

vi.mock('../../context/useCustomerContext', () => ({
  useCustomerContext: mockUseCustomerContext,
}))

vi.mock('../../hooks/useCustomerApi', () => ({
  useCustomerApi: mockUseCustomerApi,
}))

const customers: Customer[] = [
  {
    id: 1,
    name: 'Maria Garcia',
    email: 'maria.garcia@example.com',
    phone: '555-0101',
    address: '742 Evergreen Terrace',
    city: 'Springfield',
    state: 'IL',
    zip: '62704',
  },
]

describe('CustomerListPage', () => {
  const fetchCustomers = vi.fn<
    (options?: object, showLoading?: boolean) => Promise<void>
  >()
  const deleteCustomer = vi.fn<(id: number) => Promise<boolean>>()

  beforeEach(() => {
    vi.clearAllMocks()

    fetchCustomers.mockResolvedValue()
    deleteCustomer.mockResolvedValue(true)

    mockUseCustomerContext.mockReturnValue({
      state: { customers },
    })

    mockUseCustomerApi.mockReturnValue({
      loading: false,
      error: null,
      fetchCustomers,
      addCustomer: vi.fn(),
      updateCustomer: vi.fn(),
      deleteCustomer,
    })
  })

  function renderPage() {
    return render(
      <MemoryRouter>
        <CustomerListPage />
      </MemoryRouter>,
    )
  }

  it('fetches customers with full-text search when search is submitted', async () => {
    const user = userEvent.setup()

    renderPage()

    await user.type(screen.getByLabelText('Search customers'), '  maria  ')
    await user.click(screen.getByRole('button', { name: 'Search' }))

    await waitFor(() => {
      expect(fetchCustomers).toHaveBeenLastCalledWith(
        {
          search: 'maria',
          sortBy: undefined,
          sortOrder: undefined,
        },
        false,
      )
    })
  })

  it('clears the search input and refetches default results', async () => {
    const user = userEvent.setup()

    renderPage()

    await user.type(screen.getByLabelText('Search customers'), 'springfield')
    await user.click(screen.getByRole('button', { name: 'Search' }))
    await user.click(screen.getByRole('button', { name: 'Clear' }))

    expect(screen.getByLabelText('Search customers')).toHaveValue('')

    await waitFor(() => {
      expect(fetchCustomers).toHaveBeenLastCalledWith(
        {
          search: undefined,
          sortBy: undefined,
          sortOrder: undefined,
        },
        false,
      )
    })
  })

  it('requests ascending then descending sort when clicking the same column twice', async () => {
    const user = userEvent.setup()

    renderPage()

    await user.click(screen.getByRole('button', { name: /Sort by name/i }))

    await waitFor(() => {
      expect(fetchCustomers).toHaveBeenLastCalledWith(
        {
          search: undefined,
          sortBy: 'name',
          sortOrder: 'asc',
        },
        false,
      )
    })

    await user.click(screen.getByRole('button', { name: /Sort by name/i }))

    await waitFor(() => {
      expect(fetchCustomers).toHaveBeenLastCalledWith(
        {
          search: undefined,
          sortBy: 'name',
          sortOrder: 'desc',
        },
        false,
      )
    })
  })
})
