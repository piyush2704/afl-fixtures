import { act, renderHook, waitFor } from '@testing-library/react'
import { focusManager } from '@tanstack/react-query'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { apiResponse } from '@/test/fixtures'
import { createTestQueryClient, queryWrapper } from '@/test/queryClient'
import type { FixtureData } from '../types'
import { useFixtureFilters } from './useFixtureFilters'
import { useFixtures } from './useFixtures'

const fetchMock = vi.fn<typeof fetch>()
const response = () => new Response(JSON.stringify(apiResponse()))

beforeEach(() => {
  fetchMock.mockReset().mockImplementation(async () => response())
  vi.stubGlobal('fetch', fetchMock)
})

function setup() {
  const client = createTestQueryClient()
  const hook = renderHook(() => useFixtures(), { wrapper: queryWrapper(client) })
  return { client, ...hook }
}

describe('useFixtures', () => {
  it('returns parsed FixtureData and forwards the query cancellation signal', async () => {
    const { result } = setup()
    expect(result.current.isPending).toBe(true)
    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(result.current.data?.fixtures).toHaveLength(5)
    expect(result.current.data?.roundNamesByPhase[0]).toContain('Empty Round')
    expect(fetchMock.mock.calls[0][1]?.signal).toBeInstanceOf(AbortSignal)
  })

  it('retries three times after an initial failure before exposing the error', async () => {
    fetchMock.mockRejectedValue(new Error('Offline'))
    const { result } = setup()
    await waitFor(() => expect(result.current.isError).toBe(true))
    expect(fetchMock).toHaveBeenCalledTimes(4)
    expect(result.current.error?.message).toBe('Offline')
  })

  it('can recover successfully during a retry', async () => {
    fetchMock.mockRejectedValueOnce(new Error('Temporary failure')).mockRejectedValueOnce(new Error('Temporary failure'))
    const { result } = setup()
    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(fetchMock).toHaveBeenCalledTimes(3)
    expect(result.current.error).toBeNull()
  })

  it('reuses fresh cached data on remount without a new request', async () => {
    const { client, result, unmount } = setup()
    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    unmount()
    const remounted = renderHook(() => useFixtures(), { wrapper: queryWrapper(client) })
    expect(remounted.result.current.isSuccess).toBe(true)
    expect(remounted.result.current.isStale).toBe(false)
    expect(remounted.result.current.data?.fixtures).toHaveLength(5)
    await act(async () => {
      focusManager.setFocused(false)
      focusManager.setFocused(true)
    })
    expect(fetchMock).toHaveBeenCalledTimes(1)
    focusManager.setFocused(undefined)
  })

  it('cancels a pending fetch when its last subscriber unmounts', () => {
    fetchMock.mockReturnValue(new Promise<Response>(() => {}))
    const { unmount } = setup()
    const signal = fetchMock.mock.calls[0][1]?.signal
    unmount()
    expect(signal?.aborted).toBe(true)
  })

  it('keeps four-minute-old data fresh but refetches data older than five minutes on remount', async () => {
    const { client, result, unmount } = setup()
    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    const cachedData = result.current.data!
    unmount()
    client.setQueryData(['fixtures'], cachedData, { updatedAt: Date.now() - 4 * 60 * 1000 })
    const fresh = renderHook(() => useFixtures(), { wrapper: queryWrapper(client) })
    expect(fresh.result.current.isStale).toBe(false)
    expect(fetchMock).toHaveBeenCalledTimes(1)
    fresh.unmount()

    client.setQueryData(['fixtures'], cachedData, { updatedAt: Date.now() - 5 * 60 * 1000 - 1 })
    const stale = renderHook(() => useFixtures(), { wrapper: queryWrapper(client) })
    expect(stale.result.current.data).toEqual(cachedData)
    expect(stale.result.current.isFetching).toBe(true)
    expect(stale.result.current.isStale).toBe(true)
    await waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(2))
    await waitFor(() => expect(stale.result.current.isFetching).toBe(false))
    expect(stale.result.current.isStale).toBe(false)
  })

  it('allows explicit refresh while preserving filter selections and updating results', async () => {
    const client = createTestQueryClient()
    const emptyData: FixtureData = { fixtures: [], roundNamesByPhase: [] }
    const { result } = renderHook(() => {
      const query = useFixtures()
      return { query, filters: useFixtureFilters(query.data ?? emptyData) }
    }, { wrapper: queryWrapper(client) })
    await waitFor(() => expect(result.current.query.isSuccess).toBe(true))
    act(() => {
      result.current.filters.selectRound('Round 1')
      result.current.filters.selectTeams([1])
      result.current.filters.selectVenues([20])
    })
    expect(result.current.filters.visibleFixtures.map(f => f.id)).toEqual([102])
    const updated = apiResponse()
    updated.phases[0].rounds[1].matches = []
    fetchMock.mockResolvedValueOnce(new Response(JSON.stringify(updated)))
    await act(async () => { await result.current.query.refetch() })
    await waitFor(() => expect(result.current.filters.visibleFixtures).toEqual([]))
    expect(result.current.filters.selectedRound).toBe('Round 1')
    expect(result.current.filters.selectedTeamIds).toEqual([1])
    expect(result.current.filters.selectedVenueIds).toEqual([20])
    expect(fetchMock).toHaveBeenCalledTimes(2)
  })
})
