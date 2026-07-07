import { useState } from 'react'
import type { CustomerFormData } from '../types/customer'

type CustomerFormProps = {
  initialData?: CustomerFormData
  onSubmit: (data: CustomerFormData) => void
  onCancel: () => void
}

type FormErrors = Partial<Record<keyof CustomerFormData, string>>

const EMPTY_FORM: CustomerFormData = {
  name: '',
  email: '',
  phone: '',
  address: '',
  city: '',
  state: '',
  zip: '',
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function CustomerForm({ initialData, onSubmit, onCancel }: CustomerFormProps) {
  const [formData, setFormData] = useState<CustomerFormData>(() => initialData ?? EMPTY_FORM)
  const [errors, setErrors] = useState<FormErrors>({})

  const isEditMode = Boolean(initialData)

  const handleChange =
    (field: keyof CustomerFormData) =>
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const value = event.target.value

      setFormData((prev) => ({
        ...prev,
        [field]: value,
      }))

      if (errors[field]) {
        setErrors((prev) => {
          const next = { ...prev }
          delete next[field]
          return next
        })
      }
    }

  const validate = () => {
    const nextErrors: FormErrors = {}

    if (!formData.name.trim()) {
      nextErrors.name = 'Name is required.'
    }

    if (!formData.email.trim()) {
      nextErrors.email = 'Email is required.'
    } else if (!EMAIL_REGEX.test(formData.email.trim())) {
      nextErrors.email = 'Please enter a valid email address.'
    }

    if (!formData.phone.trim()) {
      nextErrors.phone = 'Phone is required.'
    }

    setErrors(nextErrors)

    return Object.keys(nextErrors).length === 0
  }

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (!validate()) {
      return
    }

    onSubmit({
      ...formData,
      name: formData.name.trim(),
      email: formData.email.trim(),
      phone: formData.phone.trim(),
      address: formData.address.trim(),
      city: formData.city.trim(),
      state: formData.state.trim(),
      zip: formData.zip.trim(),
    })
  }

  const inputStyle = (field: keyof CustomerFormData) => ({
    width: '100%',
    padding: '0.5rem',
    borderRadius: '6px',
    border: errors[field] ? '1px solid #d93025' : '1px solid #bfbfbf',
  })

  return (
    <form onSubmit={handleSubmit} noValidate>
      <div style={{ display: 'grid', gap: '1rem' }}>
        <label>
          Name
          <input
            type="text"
            value={formData.name}
            onChange={handleChange('name')}
            style={inputStyle('name')}
            aria-invalid={Boolean(errors.name)}
          />
          {errors.name ? <div style={{ color: '#d93025', marginTop: '0.25rem' }}>{errors.name}</div> : null}
        </label>

        <label>
          Email
          <input
            type="email"
            value={formData.email}
            onChange={handleChange('email')}
            style={inputStyle('email')}
            aria-invalid={Boolean(errors.email)}
          />
          {errors.email ? <div style={{ color: '#d93025', marginTop: '0.25rem' }}>{errors.email}</div> : null}
        </label>

        <label>
          Phone
          <input
            type="tel"
            value={formData.phone}
            onChange={handleChange('phone')}
            style={inputStyle('phone')}
            aria-invalid={Boolean(errors.phone)}
          />
          {errors.phone ? <div style={{ color: '#d93025', marginTop: '0.25rem' }}>{errors.phone}</div> : null}
        </label>

        <label>
          Address
          <input
            type="text"
            value={formData.address}
            onChange={handleChange('address')}
            style={inputStyle('address')}
            aria-invalid={Boolean(errors.address)}
          />
        </label>

        <label>
          City
          <input
            type="text"
            value={formData.city}
            onChange={handleChange('city')}
            style={inputStyle('city')}
            aria-invalid={Boolean(errors.city)}
          />
        </label>

        <label>
          State
          <input
            type="text"
            value={formData.state}
            onChange={handleChange('state')}
            style={inputStyle('state')}
            aria-invalid={Boolean(errors.state)}
          />
        </label>

        <label>
          ZIP
          <input
            type="text"
            value={formData.zip}
            onChange={handleChange('zip')}
            style={inputStyle('zip')}
            aria-invalid={Boolean(errors.zip)}
          />
        </label>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button type="submit">{isEditMode ? 'Update Customer' : 'Add Customer'}</button>
          <button type="button" onClick={onCancel}>
            Cancel
          </button>
        </div>
      </div>
    </form>
  )
}

export default CustomerForm
