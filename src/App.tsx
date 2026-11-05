import { AppHeader } from './components/layout/AppHeader'
import { AppFooter } from './components/layout/AppFooter'
import { FixturePage } from './features/fixtures/components/FixturePage'

export default function App() {
  return <div className="flex min-h-svh flex-col bg-background text-foreground"><AppHeader /><main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8 sm:px-6"><FixturePage /></main><AppFooter /></div>
}
