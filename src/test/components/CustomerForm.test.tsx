import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import CustomerForm from '../../components/CustomerForm'
import type { CustomerFormData } from '../../types/customer'

const initialData: CustomerFormData = {
  name: 'Maria Garcia',
  email: 'maria.garcia@example.com',
  phone: '555-0101',
  address: '742 Evergreen Terrace',
  city: 'Springfield',
  state: 'IL',
  zip: '62704',
}

function renderCustomerForm(props?: {
  initialValues?: CustomerFormData
  onSubmit?: (data: CustomerFormData) => void
  onCancel?: () => void
}) {
  const onSubmit = props?.onSubmit ?? vi.fn()
  const onCancel = props?.onCancel ?? vi.fn()

  render(
    <CustomerForm
      initialData={props?.initialValues}
      onSubmit={onSubmit}
      onCancel={onCancel}
    />,
  )

  return { onSubmit, onCancel }
}

describe('CustomerForm', () => {
  it('shows validation errors when submitting an empty form', async () => {
    const user = userEvent.setup()

    renderCustomerForm()

    await user.click(screen.getByRole('button', { name: 'Add Customer' }))

    expect(screen.getByText('Name is required.')).toBeInTheDocument()
    expect(screen.getByText('Email is required.')).toBeInTheDocument()
    expect(screen.getByText('Phone is required.')).toBeInTheDocument()
  })

  it('calls onSubmit with valid form data', async () => {
    const user = userEvent.setup()
    const { onSubmit } = renderCustomerForm()

    await user.type(screen.getByLabelText('Name'), 'James Chen')
    await user.type(screen.getByLabelText('Email'), 'james.chen@example.com')
    await user.type(screen.getByLabelText('Phone'), '555-0102')
    await user.type(screen.getByLabelText('Address'), '1600 Pennsylvania Ave')
    await user.type(screen.getByLabelText('City'), 'Washington')
    await user.type(screen.getByLabelText('State'), 'DC')
    await user.type(screen.getByLabelText('ZIP'), '20500')

    await user.click(screen.getByRole('button', { name: 'Add Customer' }))

    expect(onSubmit).toHaveBeenCalledTimes(1)
    expect(onSubmit).toHaveBeenCalledWith({
      name: 'James Chen',
      email: 'james.chen@example.com',
      phone: '555-0102',
      address: '1600 Pennsylvania Ave',
      city: 'Washington',
      state: 'DC',
      zip: '20500',
    })
  })

  it('calls onCancel when cancel button is clicked', async () => {
    const user = userEvent.setup()
    const { onCancel } = renderCustomerForm()

    await user.click(screen.getByRole('button', { name: 'Cancel' }))

    expect(onCancel).toHaveBeenCalledTimes(1)
  })

  it('pre-fills form values when initialData is provided', () => {
    renderCustomerForm({ initialValues: initialData })

    expect(screen.getByLabelText('Name')).toHaveValue('Maria Garcia')
    expect(screen.getByLabelText('Email')).toHaveValue('maria.garcia@example.com')
    expect(screen.getByLabelText('Phone')).toHaveValue('555-0101')
    expect(screen.getByLabelText('Address')).toHaveValue('742 Evergreen Terrace')
    expect(screen.getByLabelText('City')).toHaveValue('Springfield')
    expect(screen.getByLabelText('State')).toHaveValue('IL')
    expect(screen.getByLabelText('ZIP')).toHaveValue('62704')
    expect(
      screen.getByRole('button', { name: 'Update Customer' }),
    ).toBeInTheDocument()
  })

  it('shows invalid email error and clears it after typing a valid email', async () => {
    const user = userEvent.setup()

    renderCustomerForm()

    await user.type(screen.getByLabelText('Name'), 'Taylor Jenkins')
    await user.type(screen.getByLabelText('Email'), 'not-an-email')
    await user.type(screen.getByLabelText('Phone'), '555-2199')
    await user.click(screen.getByRole('button', { name: 'Add Customer' }))

    expect(
      screen.getByText('Please enter a valid email address.'),
    ).toBeInTheDocument()

    const emailInput = screen.getByRole('textbox', { name: /email/i })

    await user.clear(emailInput)
    await user.type(emailInput, 'taylor.jenkins@example.com')

    expect(
      screen.queryByText('Please enter a valid email address.'),
    ).not.toBeInTheDocument()
  })
})
