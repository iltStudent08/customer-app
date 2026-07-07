import { useState } from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import ErrorBoundary from '../../components/ErrorBoundary'

type MaybeCrashProps = {
  shouldThrow: boolean
}

function MaybeCrash({ shouldThrow }: MaybeCrashProps) {
  if (shouldThrow) {
    throw new Error('Boom from test component')
  }

  return <p>Everything is working.</p>
}

function RecoveryHarness() {
  const [shouldThrow, setShouldThrow] = useState(true)

  return (
    <>
      <button type="button" onClick={() => setShouldThrow(false)}>
        Repair Child
      </button>
      <ErrorBoundary>
        <MaybeCrash shouldThrow={shouldThrow} />
      </ErrorBoundary>
    </>
  )
}

describe('ErrorBoundary', () => {
  it('renders children when no error is thrown', () => {
    render(
      <ErrorBoundary>
        <MaybeCrash shouldThrow={false} />
      </ErrorBoundary>,
    )

    expect(screen.getByText('Everything is working.')).toBeInTheDocument()
  })

  it('shows a friendly fallback message with error details', () => {
    const consoleErrorSpy = vi
      .spyOn(console, 'error')
      .mockImplementation(() => undefined)

    render(
      <ErrorBoundary>
        <MaybeCrash shouldThrow />
      </ErrorBoundary>,
    )

    expect(
      screen.getByRole('heading', { name: 'Something went wrong' }),
    ).toBeInTheDocument()
    expect(
      screen.getByText(/We ran into an unexpected error:/),
    ).toBeInTheDocument()
    expect(screen.getByText(/Boom from test component/)).toBeInTheDocument()

    consoleErrorSpy.mockRestore()
  })

  it('recovers when Try Again is clicked after the child is repaired', async () => {
    const user = userEvent.setup()
    const consoleErrorSpy = vi
      .spyOn(console, 'error')
      .mockImplementation(() => undefined)

    render(<RecoveryHarness />)

    expect(
      screen.getByRole('heading', { name: 'Something went wrong' }),
    ).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Repair Child' }))
    await user.click(screen.getByRole('button', { name: 'Try Again' }))

    expect(screen.getByText('Everything is working.')).toBeInTheDocument()

    consoleErrorSpy.mockRestore()
  })
})
