import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { alpha } from '@/test/fixtures'
import { Team } from './Team'

describe('Team accessible presentation', () => {
  it('provides descriptive score text without relying on aria-label on a paragraph', () => {
    render(<Team squad={alpha} />)
    expect(screen.getByText('0.0 (0)')).toHaveAttribute('aria-hidden', 'true')
    const description = screen.getByText('Alpha: 0 goals, 0 behinds, 0 points')
    expect(description).toHaveClass('sr-only')
    expect(description).not.toHaveAttribute('aria-hidden')
    expect(description.parentElement).not.toHaveAttribute('aria-label')
  })

  it('keeps the team name and score description when a decorative logo fails', () => {
    render(<Team squad={alpha} />)
    fireEvent.error(screen.getByAltText(''))
    expect(screen.getByText('Alpha')).toBeInTheDocument()
    expect(screen.queryByAltText('')).not.toBeInTheDocument()
    expect(screen.getByText('Alpha: 0 goals, 0 behinds, 0 points')).toBeInTheDocument()
  })
})
