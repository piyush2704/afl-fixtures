import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import axe from 'axe-core'
import { describe, expect, it, vi } from 'vitest'
import App from '../App'
import { apiResponse } from './fixtures'
import { renderWithQuery } from './queryClient'

// DOM-level checks only: contrast/layout and screen-reader behavior need browser/manual review.
describe('accessibility audit', () => {
  it('audits loading, results, open filters, empty results, and request errors', async () => {
    async function audit() {
      const result = await axe.run(document.body, {
        runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa', 'best-practice'] },
        rules: { 'color-contrast': { enabled: false } },
      })
      expect(result.violations).toEqual([])
      expect(result.incomplete).toEqual([])
    }
    document.documentElement.lang = 'en'
    document.title = 'AFL Fixtures'
    vi.stubGlobal('fetch', vi.fn(() => new Promise<Response>(() => {})))
    const loading = renderWithQuery(<App />)
    await audit()
    loading.unmount()

    vi.stubGlobal('fetch', vi.fn(async () => new Response(JSON.stringify(apiResponse()))))
    const results = renderWithQuery(<App />)
    await screen.findByRole('button', { name: 'Filter by team' })
    await audit()
    const user = userEvent.setup()
    await user.click(screen.getByRole('button', { name: 'Filter by team' }))
    await audit()
    await user.keyboard('{Escape}')
    await user.click(screen.getByRole('button', { name: 'Filter by venue' }))
    await audit()
    await user.keyboard('{Escape}')
    await user.click(screen.getByRole('radio', { name: 'Empty Round' }))
    await audit()
    results.unmount()

    vi.stubGlobal('fetch', vi.fn(async () => new Response(JSON.stringify({ phases: [] }))))
    const empty = renderWithQuery(<App />)
    await screen.findByText('No fixtures available.')
    await audit()
    empty.unmount()

    vi.stubGlobal('fetch', vi.fn(async () => { throw new Error('Network unavailable') }))
    renderWithQuery(<App />)
    await screen.findByRole('alert')
    await audit()
  }, 30000)
})
