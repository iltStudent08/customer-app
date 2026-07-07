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

  return (
    <form onSubmit={handleSubmit} noValidate>
      <div className="form-grid">
        <label className="form-field">
          Name
          <input
            type="text"
            value={formData.name}
            onChange={handleChange('name')}
            className={errors.name ? 'form-input form-input--error' : 'form-input'}
            aria-invalid={Boolean(errors.name)}
          />
          {errors.name ? <div className="field-error">{errors.name}</div> : null}
        </label>

        <label className="form-field">
          Email
          <input
            type="email"
            value={formData.email}
            onChange={handleChange('email')}
            className={errors.email ? 'form-input form-input--error' : 'form-input'}
            aria-invalid={Boolean(errors.email)}
          />
          {errors.email ? <div className="field-error">{errors.email}</div> : null}
        </label>

        <label className="form-field">
          Phone
          <input
            type="tel"
            value={formData.phone}
            onChange={handleChange('phone')}
            className={errors.phone ? 'form-input form-input--error' : 'form-input'}
            aria-invalid={Boolean(errors.phone)}
          />
          {errors.phone ? <div className="field-error">{errors.phone}</div> : null}
        </label>

        <label className="form-field">
          Address
          <input
            type="text"
            value={formData.address}
            onChange={handleChange('address')}
            className="form-input"
            aria-invalid={Boolean(errors.address)}
          />
        </label>

        <label className="form-field">
          City
          <input
            type="text"
            value={formData.city}
            onChange={handleChange('city')}
            className="form-input"
            aria-invalid={Boolean(errors.city)}
          />
        </label>

        <label className="form-field">
          State
          <input
            type="text"
            value={formData.state}
            onChange={handleChange('state')}
            className="form-input"
            aria-invalid={Boolean(errors.state)}
          />
        </label>

        <label className="form-field">
          ZIP
          <input
            type="text"
            value={formData.zip}
            onChange={handleChange('zip')}
            className="form-input"
            aria-invalid={Boolean(errors.zip)}
          />
        </label>

        <div className="form-actions">
          <button type="submit" className="btn btn--primary">
            {isEditMode ? 'Update Customer' : 'Add Customer'}
          </button>
          <button type="button" className="btn" onClick={onCancel}>
            Cancel
          </button>
        </div>
      </div>
    </form>
  )
}

export default CustomerForm
