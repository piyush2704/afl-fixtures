import { beforeEach, describe, expect, it, vi } from 'vitest'
import { fetchFixtureResponse } from './fixtureService'

const fetchMock = vi.fn<typeof fetch>()
beforeEach(() => {
  fetchMock.mockReset()
  vi.stubGlobal('fetch', fetchMock)
})

describe('fetchFixtureResponse', () => {
  it('requests the supplied endpoint with cancellation support and returns JSON', async () => {
    const payload = { phases: [] }
    fetchMock.mockResolvedValueOnce(new Response(JSON.stringify(payload)))
    const controller = new AbortController()
    await expect(fetchFixtureResponse(controller.signal)).resolves.toEqual(payload)
    expect(fetchMock).toHaveBeenCalledWith(
      'https://0p0s8y841d.execute-api.ap-southeast-2.amazonaws.com/test/react-code-test/fixture',
      { signal: controller.signal },
    )
  })

  it('rejects HTTP errors even when the body contains valid fixture JSON', async () => {
    fetchMock.mockResolvedValueOnce(new Response('{"phases":[]}', { status: 500 }))
    await expect(fetchFixtureResponse()).rejects.toThrow('Unable to load fixtures (HTTP 500).')
  })

  it('propagates network failures', async () => {
    fetchMock.mockRejectedValueOnce(new TypeError('Failed to fetch'))
    await expect(fetchFixtureResponse()).rejects.toThrow('Failed to fetch')
  })

  it('rejects invalid JSON instead of returning empty data', async () => {
    fetchMock.mockResolvedValueOnce(new Response('not json'))
    await expect(fetchFixtureResponse()).rejects.toBeInstanceOf(SyntaxError)
  })

  it('propagates cancellation without converting it into a successful empty result', async () => {
    fetchMock.mockRejectedValueOnce(new DOMException('Aborted', 'AbortError'))
    await expect(fetchFixtureResponse()).rejects.toMatchObject({ name: 'AbortError' })
  })
})
