const FIXTURE_PATH = '/fixture'

export async function fetchFixtureResponse(signal?: AbortSignal): Promise<unknown> {
  const baseUrl = import.meta.env.VITE_API_BASE_URL?.trim()

  if (!baseUrl) {
    throw new Error('The fixture API base URL is not configured.')
  }

  const url = `${baseUrl.replace(/\/+$/, '')}${FIXTURE_PATH}`
  const response = await fetch(url, { signal })

  if (!response.ok) {
    throw new Error(`Unable to load fixtures (HTTP ${response.status}).`)
  }

  return response.json()
}
