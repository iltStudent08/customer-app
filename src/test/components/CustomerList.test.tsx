import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it, vi } from 'vitest'
import CustomerList from '../../components/CustomerList'
import type { Customer, CustomerSortField } from '../../types/customer'

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
  {
    id: 2,
    name: 'James Chen',
    email: 'james.chen@example.com',
    phone: '555-0102',
    address: '1600 Pennsylvania Ave',
    city: 'Washington',
    state: 'DC',
    zip: '20500',
  },
]

function renderCustomerList(
  customerData: Customer[],
  onDeleteCustomer: (id: number) => void = vi.fn(),
  options?: {
    onSort?: (field: CustomerSortField) => void
    sortField?: CustomerSortField | null
    sortOrder?: 'asc' | 'desc'
  },
) {
  return render(
    <MemoryRouter>
      <CustomerList
        customers={customerData}
        onDeleteCustomer={onDeleteCustomer}
        onSort={options?.onSort ?? vi.fn()}
        sortField={options?.sortField ?? null}
        sortOrder={options?.sortOrder ?? 'asc'}
      />
    </MemoryRouter>,
  )
}

describe('CustomerList', () => {
  it('renders all customer names', () => {
    renderCustomerList(customers)

    expect(screen.getByText('Maria Garcia')).toBeInTheDocument()
    expect(screen.getByText('James Chen')).toBeInTheDocument()
  })

  it('shows empty state when there are no customers', () => {
    renderCustomerList([])

    expect(screen.getByText('No customers found.')).toBeInTheDocument()
  })

  it('calls delete handler with the correct customer id', async () => {
    const user = userEvent.setup()
    const onDelete = vi.fn()
    const confirmSpy = vi
      .spyOn(window, 'confirm')
      .mockReturnValue(true)

    renderCustomerList(customers, onDelete)

    await user.click(
      screen.getByRole('button', { name: 'Delete James Chen' }),
    )

    expect(onDelete).toHaveBeenCalledTimes(1)
    expect(onDelete).toHaveBeenCalledWith(2)

    confirmSpy.mockRestore()
  })

  it('does not call delete handler when confirmation is cancelled', async () => {
    const user = userEvent.setup()
    const onDelete = vi.fn()
    const confirmSpy = vi
      .spyOn(window, 'confirm')
      .mockReturnValue(false)

    renderCustomerList(customers, onDelete)

    await user.click(
      screen.getByRole('button', { name: 'Delete James Chen' }),
    )

    expect(onDelete).not.toHaveBeenCalled()

    confirmSpy.mockRestore()
  })

  it('renders edit links with the correct route', () => {
    renderCustomerList(customers)

    const editLinks = screen.getAllByRole('link', { name: /Edit/ })

    expect(editLinks).toHaveLength(2)
    expect(editLinks[0]).toHaveAttribute('href', '/edit/1')
    expect(editLinks[1]).toHaveAttribute('href', '/edit/2')
  })

  it('calls sort handler when a column header is clicked', async () => {
    const user = userEvent.setup()
    const onSort = vi.fn()

    renderCustomerList(customers, vi.fn(), { onSort })

    await user.click(screen.getByRole('button', { name: /Sort by name/i }))

    expect(onSort).toHaveBeenCalledTimes(1)
    expect(onSort).toHaveBeenCalledWith('name')
  })

  it('renders descending aria-label for active ascending column', () => {
    renderCustomerList(customers, vi.fn(), {
      sortField: 'email',
      sortOrder: 'asc',
    })

    expect(
      screen.getByRole('button', { name: 'Sort by email descending' }),
    ).toBeInTheDocument()
    expect(screen.getByText('↑')).toBeInTheDocument()
  })

  it('renders ascending aria-label for active descending column', () => {
    renderCustomerList(customers, vi.fn(), {
      sortField: 'city',
      sortOrder: 'desc',
    })

    expect(
      screen.getByRole('button', { name: 'Sort by city ascending' }),
    ).toBeInTheDocument()
    expect(screen.getByText('↓')).toBeInTheDocument()
  })
})
