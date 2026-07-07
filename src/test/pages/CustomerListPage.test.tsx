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
      totalCount: 100,
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
          page: 1,
          perPage: 10,
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
          page: 1,
          perPage: 10,
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
          page: 1,
          perPage: 10,
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
          page: 1,
          perPage: 10,
        },
        false,
      )
    })
  })

  it('uses default pagination of page 1 with 10 rows', async () => {
    renderPage()

    await waitFor(() => {
      expect(fetchCustomers).toHaveBeenCalledWith(
        {
          search: undefined,
          sortBy: undefined,
          sortOrder: undefined,
          page: 1,
          perPage: 10,
        },
        false,
      )
    })

    expect(screen.getByText('Page 1 of 10 (100 records)')).toBeInTheDocument()
  })

  it('changes rows per page to 25 and then 50', async () => {
    const user = userEvent.setup()

    renderPage()

    await user.selectOptions(screen.getByLabelText('Rows per page'), '25')

    await waitFor(() => {
      expect(fetchCustomers).toHaveBeenLastCalledWith(
        {
          search: undefined,
          sortBy: undefined,
          sortOrder: undefined,
          page: 1,
          perPage: 25,
        },
        false,
      )
    })

    await user.selectOptions(screen.getByLabelText('Rows per page'), '50')

    await waitFor(() => {
      expect(fetchCustomers).toHaveBeenLastCalledWith(
        {
          search: undefined,
          sortBy: undefined,
          sortOrder: undefined,
          page: 1,
          perPage: 50,
        },
        false,
      )
    })
  })

  it('goes to next page and requests the new page', async () => {
    const user = userEvent.setup()

    renderPage()

    await user.click(screen.getByRole('button', { name: 'Next' }))

    await waitFor(() => {
      expect(fetchCustomers).toHaveBeenLastCalledWith(
        {
          search: undefined,
          sortBy: undefined,
          sortOrder: undefined,
          page: 2,
          perPage: 10,
        },
        false,
      )
    })
  })

  it('goes back to previous page after navigating forward', async () => {
    const user = userEvent.setup()

    renderPage()

    await user.click(screen.getByRole('button', { name: 'Next' }))
    await user.click(screen.getByRole('button', { name: 'Previous' }))

    await waitFor(() => {
      expect(fetchCustomers).toHaveBeenLastCalledWith(
        {
          search: undefined,
          sortBy: undefined,
          sortOrder: undefined,
          page: 1,
          perPage: 10,
        },
        false,
      )
    })
  })

  it('deletes customer from page list through list action', async () => {
    const user = userEvent.setup()
    const confirmSpy = vi.spyOn(window, 'confirm').mockReturnValue(true)

    renderPage()

    await user.click(screen.getByRole('button', { name: 'Delete Maria Garcia' }))

    await waitFor(() => {
      expect(deleteCustomer).toHaveBeenCalledWith(1)
    })

    confirmSpy.mockRestore()
  })
})
