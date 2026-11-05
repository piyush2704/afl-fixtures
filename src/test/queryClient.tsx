import type { ReactNode } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { render } from '@testing-library/react'
import { afterEach } from 'vitest'

const clients: QueryClient[] = []

export function createTestQueryClient() {
  const client = new QueryClient({
    defaultOptions: { queries: { retryDelay: 0, gcTime: Infinity } },
  })
  clients.push(client)
  return client
}

export function queryWrapper(client: QueryClient) {
  return function QueryWrapper({ children }: { children: ReactNode }) {
    return <QueryClientProvider client={client}>{children}</QueryClientProvider>
  }
}

export function renderWithQuery(ui: ReactNode) {
  return render(ui, { wrapper: queryWrapper(createTestQueryClient()) })
}

afterEach(() => {
  for (const client of clients) client.clear()
  clients.length = 0
})
