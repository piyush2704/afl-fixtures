import { useState } from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { MultiSelect } from './multi-select'

const options = [{ value: 1, label: 'Alpha' }, { value: 2, label: 'Beta' }]

function Example() {
  const [values, setValues] = useState<number[]>([])
  return <>
    <MultiSelect id="test-options" label="Teams" options={options} selectedValues={values} onChange={setValues} />
    <button type="button">Outside</button>
  </>
}

describe('MultiSelect', () => {
  it('starts closed and opens with options, accessible state and focus on the first checkbox', async () => {
    const user = userEvent.setup()
    render(<Example />)
    const trigger = screen.getByRole('button', { name: 'Teams' })
    expect(trigger).toHaveAttribute('aria-expanded', 'false')
    expect(screen.queryByRole('checkbox')).not.toBeInTheDocument()
    await user.click(trigger)
    expect(trigger).toHaveAttribute('aria-expanded', 'true')
    expect(screen.getByRole('group', { name: 'Teams' })).toHaveAttribute('id', trigger.getAttribute('aria-controls'))
    expect(screen.getByRole('checkbox', { name: 'Alpha' })).toHaveFocus()
  })

  it('selects and deselects multiple options without closing, updating the selected count', async () => {
    const user = userEvent.setup()
    render(<Example />)
    await user.click(screen.getByRole('button', { name: 'Teams' }))
    await user.click(screen.getByRole('checkbox', { name: 'Alpha' }))
    await user.click(screen.getByRole('checkbox', { name: 'Beta' }))
    expect(screen.getByRole('button', { name: 'Teams (2 selected)' })).toHaveAttribute('aria-expanded', 'true')
    await user.click(screen.getByRole('checkbox', { name: 'Alpha' }))
    expect(screen.getByRole('checkbox', { name: 'Alpha' })).not.toBeChecked()
    expect(screen.getByRole('checkbox', { name: 'Beta' })).toBeChecked()
    expect(screen.getByRole('button', { name: 'Teams (1 selected)' })).toBeInTheDocument()
  })

  it('opens using ArrowDown, allows keyboard selection and returns focus on Escape', async () => {
    const user = userEvent.setup()
    render(<Example />)
    await user.tab()
    await user.keyboard('{ArrowDown}')
    expect(screen.getByRole('checkbox', { name: 'Alpha' })).toHaveFocus()
    await user.keyboard(' ')
    expect(screen.getByRole('checkbox', { name: 'Alpha' })).toBeChecked()
    await user.keyboard('{Escape}')
    expect(screen.queryByRole('checkbox')).not.toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Teams (1 selected)' })).toHaveFocus()
  })

  it('closes when clicking outside without clearing selected values', async () => {
    const user = userEvent.setup()
    render(<Example />)
    await user.click(screen.getByRole('button', { name: 'Teams' }))
    await user.click(screen.getByRole('checkbox', { name: 'Alpha' }))
    await user.click(screen.getByRole('button', { name: 'Outside' }))
    expect(screen.queryByRole('checkbox')).not.toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Teams (1 selected)' }))
    expect(screen.getByRole('checkbox', { name: 'Alpha' })).toBeChecked()
  })

  it('closes after tabbing past the last option', async () => {
    const user = userEvent.setup()
    render(<Example />)
    await user.click(screen.getByRole('button', { name: 'Teams' }))
    await user.tab()
    expect(screen.getByRole('checkbox', { name: 'Beta' })).toHaveFocus()
    await user.tab()
    expect(screen.getByRole('button', { name: 'Outside' })).toHaveFocus()
    expect(screen.queryByRole('checkbox')).not.toBeInTheDocument()
  })

  it('reflects externally reset values while open', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    const { rerender } = render(<MultiSelect id="teams" label="Teams" options={options} selectedValues={[1]} onChange={onChange} />)
    await user.click(screen.getByRole('button', { name: 'Teams (1 selected)' }))
    expect(screen.getByRole('checkbox', { name: 'Alpha' })).toBeChecked()
    rerender(<MultiSelect id="teams" label="Teams" options={options} selectedValues={[]} onChange={onChange} />)
    expect(screen.getByRole('checkbox', { name: 'Alpha' })).not.toBeChecked()
    expect(screen.getByRole('button', { name: 'Teams' })).toBeInTheDocument()
  })

  it('reports typed string values and supports an empty option list', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    const { unmount } = render(<MultiSelect id="strings" label="Venues" options={[{ value: 'east', label: 'East' }]} selectedValues={[]} onChange={onChange} />)
    await user.click(screen.getByRole('button', { name: 'Venues' }))
    await user.click(screen.getByRole('checkbox', { name: 'East' }))
    expect(onChange).toHaveBeenCalledWith(['east'])
    unmount()
    render(<MultiSelect id="empty" label="Venues" options={[]} selectedValues={[]} onChange={onChange} emptyMessage="No venues available." />)
    await user.click(screen.getByRole('button', { name: 'Venues' }))
    expect(screen.getByText('No venues available.')).toBeInTheDocument()
    expect(screen.queryByRole('checkbox')).not.toBeInTheDocument()
  })
})
