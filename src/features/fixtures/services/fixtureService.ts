const BASE_URL = 'https://0p0s8y841d.execute-api.ap-southeast-2.amazonaws.com/test/react-code-test'
const FIXTURE_PATH = '/fixture'

export async function fetchFixtureResponse(signal?: AbortSignal): Promise<unknown> {
  const response = await fetch(`${BASE_URL}${FIXTURE_PATH}`, { signal })

  if (!response.ok) {
    throw new Error(`Unable to load fixtures (HTTP ${response.status}).`)
  }

  return response.json()
}
