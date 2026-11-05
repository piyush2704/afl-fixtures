import { StrictMode } from 'react'
import { act, render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { apiResponse } from '@/test/fixtures'
import { createTestQueryClient, queryWrapper, renderWithQuery } from '@/test/queryClient'
import { FixturePage } from './FixturePage'

const fetchMock = vi.fn<typeof fetch>()
const response = () => new Response(JSON.stringify(apiResponse()), { status: 200 })

beforeEach(() => {
  vi.stubGlobal('fetch', fetchMock)
  fetchMock.mockReset().mockImplementation(async () => response())
})

async function loadedPage() {
  const user = userEvent.setup()
  renderWithQuery(<FixturePage />)
  await screen.findByRole('button', { name: 'Filter by team' })
  return user
}

describe('FixturePage loading and errors', () => {
  it('shows loading and hides controls until data arrives, then renders matches and byes', async () => {
    let resolve!: (response: Response) => void
    fetchMock.mockReturnValueOnce(new Promise<Response>(done => { resolve = done }))
    renderWithQuery(<FixturePage />)
    expect(screen.getByRole('status')).toHaveTextContent('Loading fixtures')
    expect(screen.queryByRole('button', { name: 'Reset filters' })).not.toBeInTheDocument()
    expect(screen.queryByRole('radio')).not.toBeInTheDocument()
    await act(async () => resolve(response()))
    expect(await screen.findAllByRole('listitem')).toHaveLength(5)
    expect(screen.queryByText('Loading fixtures')).not.toBeInTheDocument()
    expect(screen.getByText('Bye')).toBeInTheDocument()
    expect(within(screen.getAllByRole('listitem')[0]).getByText('0.0 (0)')).toBeInTheDocument()
    expect(fetchMock).toHaveBeenCalledWith(
      'https://0p0s8y841d.execute-api.ap-southeast-2.amazonaws.com/test/react-code-test/fixture',
      expect.objectContaining({ signal: expect.any(AbortSignal) }),
    )
  })

  it.each([
    { name: 'network failure', fail: () => Promise.reject(new Error('Network unavailable')), message: 'Network unavailable' },
    { name: 'HTTP failure', fail: async () => new Response('', { status: 503 }), message: 'HTTP 503' },
    { name: 'invalid JSON', fail: async () => new Response('not json'), message: null },
    { name: 'incompatible payload', fail: async () => new Response('{}'), message: 'no phases collection' },
    { name: 'non-Error rejection', fail: () => Promise.reject('failed'), message: 'Unable to load fixtures.' },
  ])('shows a persistent alert for $name without displaying filters or fixtures', async ({ fail, message }) => {
    fetchMock.mockImplementation(fail)
    renderWithQuery(<FixturePage />)
    const alert = await screen.findByRole('alert')
    expect(alert).toHaveTextContent('Unable to load fixtures')
    if (message) expect(alert).toHaveTextContent(message)
    expect(screen.queryByText('Loading fixtures')).not.toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Reset filters' })).not.toBeInTheDocument()
    expect(screen.queryByRole('listitem')).not.toBeInTheDocument()
  })

  it('distinguishes successful empty data from errors and retains controls', async () => {
    fetchMock.mockResolvedValueOnce(new Response(JSON.stringify({ phases: [] })))
    const user = await loadedPage()
    expect(screen.getByRole('status')).toHaveTextContent('No fixtures available.')
    expect(screen.queryByRole('alert')).not.toBeInTheDocument()
    expect(screen.getByRole('radio', { name: 'All fixtures' })).toBeChecked()
    await user.click(screen.getByRole('button', { name: 'Filter by team' }))
    expect(screen.getByText('No teams available.')).toBeInTheDocument()
  })

  it('aborts a pending request on unmount and does not affect a later mount', async () => {
    let resolve!: (response: Response) => void
    fetchMock.mockReturnValueOnce(new Promise<Response>(done => { resolve = done }))
    const oldPage = renderWithQuery(<FixturePage />)
    const signal = fetchMock.mock.calls[0][1]?.signal
    oldPage.unmount()
    expect(signal?.aborted).toBe(true)
    await loadedPage()
    await act(async () => resolve(new Response(JSON.stringify({ phases: [] }))))
    expect(screen.getAllByRole('listitem')).toHaveLength(5)
    expect(screen.queryByText('No fixtures available.')).not.toBeInTheDocument()
  })

  it('ignores the aborted StrictMode request without duplicating entries or showing an error', async () => {
    fetchMock.mockImplementation(async (_url, options) => {
      await Promise.resolve()
      if (options?.signal?.aborted) throw new DOMException('Aborted', 'AbortError')
      return response()
    })
    renderWithQuery(<StrictMode><FixturePage /></StrictMode>)
    await screen.findByRole('button', { name: 'Reset filters' })
    expect(screen.getAllByRole('listitem')).toHaveLength(5)
    expect(screen.queryByRole('alert')).not.toBeInTheDocument()
  })
})

describe('FixturePage filter controls', () => {
  it('combines multiple teams and venues with a round without refetching and resets everything', async () => {
    const user = await loadedPage()
    await user.click(screen.getByRole('button', { name: 'Filter by team' }))
    await user.click(screen.getByRole('checkbox', { name: 'Alpha' }))
    await user.click(screen.getByRole('checkbox', { name: 'Beta' }))
    await user.keyboard('{Escape}')
    expect(screen.getByRole('button', { name: 'Filter by team (2 selected)' })).toHaveFocus()
    await user.click(screen.getByRole('button', { name: 'Filter by venue' }))
    await user.click(screen.getByRole('checkbox', { name: 'East Ground' }))
    await user.click(screen.getByRole('checkbox', { name: 'West Ground' }))
    await user.keyboard('{Escape}')
    await user.click(screen.getByRole('radio', { name: 'Round 2' }))
    expect(screen.getAllByRole('listitem')).toHaveLength(1)
    expect(screen.getByRole('listitem')).toHaveTextContent('Alpha')
    expect(screen.getByRole('listitem')).toHaveTextContent('Beta')
    expect(fetchMock).toHaveBeenCalledTimes(1)
    await user.click(screen.getByRole('button', { name: 'Reset filters' }))
    expect(screen.getAllByRole('listitem')).toHaveLength(5)
    expect(screen.getByRole('radio', { name: 'All fixtures' })).toBeChecked()
    expect(screen.getByRole('button', { name: 'Filter by team' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Filter by venue' })).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Filter by team' }))
    expect(screen.getAllByRole('checkbox').every(input => !(input as HTMLInputElement).checked)).toBe(true)
  })

  it('shows selected-team byes only under All fixtures and without a venue restriction', async () => {
    const user = await loadedPage()
    await user.click(screen.getByRole('button', { name: 'Filter by team' }))
    await user.click(screen.getByRole('checkbox', { name: 'Alpha' }))
    await user.keyboard('{Escape}')
    expect(screen.getAllByRole('listitem')).toHaveLength(3)
    expect(screen.getByText('Bye')).toBeInTheDocument()
    await user.click(screen.getByRole('radio', { name: 'Round 1' }))
    expect(screen.getAllByRole('listitem')).toHaveLength(1)
    expect(screen.queryByText('Bye')).not.toBeInTheDocument()
    await user.click(screen.getByRole('radio', { name: 'All fixtures' }))
    expect(screen.getByText('Bye')).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Filter by venue' }))
    await user.click(screen.getByRole('checkbox', { name: 'East Ground' }))
    expect(screen.queryByText('Bye')).not.toBeInTheDocument()
    expect(screen.getAllByRole('listitem')).toHaveLength(1)
  })

  it('explains an empty filter combination and keeps options available for recovery', async () => {
    const user = await loadedPage()
    await user.click(screen.getByRole('button', { name: 'Filter by team' }))
    await user.click(screen.getByRole('checkbox', { name: 'Alpha' }))
    await user.keyboard('{Escape}')
    await user.click(screen.getByRole('button', { name: 'Filter by venue' }))
    await user.click(screen.getByRole('checkbox', { name: 'East Ground' }))
    await user.keyboard('{Escape}')
    await user.click(screen.getByRole('radio', { name: 'Round 1' }))
    expect(screen.getByRole('status')).toHaveTextContent('No fixtures available for Alpha at East Ground in Round 1.')
    expect(screen.queryByRole('listitem')).not.toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Filter by team (1 selected)' }))
    expect(within(screen.getByRole('group', { name: 'Filter by team' })).getAllByRole('checkbox')).toHaveLength(3)
    await user.click(screen.getByRole('checkbox', { name: 'Alpha' }))
    expect(screen.getAllByRole('listitem')).toHaveLength(1)
    expect(screen.getByRole('radio', { name: 'Round 1' })).toBeChecked()
    await waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(1))
  })

  it('retains empty rounds as full-name options in API order', async () => {
    const user = await loadedPage()
    expect(screen.getAllByRole('radio').map(input => input.getAttribute('aria-label'))).toEqual([
      'All fixtures', 'Round 2', 'Round 1', 'Empty Round', 'Finals Round 1',
    ])
    await user.click(screen.getByRole('radio', { name: 'Empty Round' }))
    expect(screen.getByRole('status')).toHaveTextContent('No fixtures available in Empty Round.')
    await user.click(screen.getByRole('radio', { name: 'Empty Round' }))
    expect(screen.getByRole('radio', { name: 'Empty Round' })).toBeChecked()
  })

  it('updates a polite atomic results status while keeping focus on the filter', async () => {
    const user = await loadedPage()
    expect(screen.getByRole('status')).toHaveTextContent('5 fixtures found.')
    expect(screen.getByRole('status')).toHaveAttribute('aria-atomic', 'true')
    const round = screen.getByRole('radio', { name: 'Round 2' })
    await user.click(round)
    expect(screen.getByRole('status')).toHaveTextContent('1 fixture found.')
    expect(round).toHaveFocus()
    await user.click(screen.getByRole('button', { name: 'Reset filters' }))
    expect(screen.getByRole('status')).toHaveTextContent('5 fixtures found.')
  })

  it('keeps cached fixtures and active filters usable after a failed background refresh', async () => {
    const user = userEvent.setup()
    const client = createTestQueryClient()
    render(<FixturePage />, { wrapper: queryWrapper(client) })
    await screen.findByRole('button', { name: 'Filter by team' })
    await user.click(screen.getByRole('button', { name: 'Filter by team' }))
    await user.click(screen.getByRole('checkbox', { name: 'Alpha' }))
    await user.keyboard('{Escape}')
    expect(screen.getAllByRole('listitem')).toHaveLength(3)
    fetchMock.mockRejectedValue(new Error('Temporary refresh failure'))
    await act(async () => { await client.invalidateQueries({ queryKey: ['fixtures'] }) })
    expect(await screen.findByRole('alert')).toHaveTextContent('Unable to refresh fixtures')
    expect(screen.getByRole('alert')).toHaveTextContent('Showing the previously loaded schedule')
    expect(screen.getAllByRole('listitem')).toHaveLength(3)
    expect(screen.getByRole('button', { name: 'Filter by team (1 selected)' })).toBeInTheDocument()
    await user.click(screen.getByRole('radio', { name: 'Round 1' }))
    expect(screen.getAllByRole('listitem')).toHaveLength(1)
    expect(screen.getByRole('status')).toHaveTextContent('1 fixture found.')
    fetchMock.mockImplementation(async () => response())
    await act(async () => { await client.invalidateQueries({ queryKey: ['fixtures'] }) })
    await waitFor(() => expect(screen.queryByRole('alert')).not.toBeInTheDocument())
    expect(screen.getByRole('radio', { name: 'Round 1' })).toBeChecked()
  })

})
