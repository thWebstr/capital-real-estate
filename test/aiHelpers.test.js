import { describe, it, expect } from 'vitest'
import { parsePriceFromText, calculateMortgage, formatCurrency, searchProperties } from '../src/utils/aiHelpers'
import properties from '../src/data/properties'

describe('aiHelpers', () => {
  it('parses prices with $, k, m', () => {
    expect(parsePriceFromText('$400k')).toBe(400000)
    expect(parsePriceFromText('695000')).toBe(695000)
    expect(parsePriceFromText('$1.2m')).toBe(1200000)
  })

  it('calculates mortgage', () => {
    const r = calculateMortgage(400000, 20, 6.5, 30)
    expect(r.downPayment).toBe(80000)
    expect(r.principal).toBeGreaterThan(0)
    expect(r.monthly).toBeGreaterThan(0)
  })

  it('formats currency', () => {
    expect(formatCurrency(400000)).toBe('$400,000')
  })

  it('searchProperties filters by city and price and beds', () => {
    const res = searchProperties(properties, { priceMax: 500000, city: 'Austin', bedrooms: 3 })
    expect(res.length).toBeGreaterThan(0)
    expect(res.every(p => p.price <= 500000)).toBe(true)
    expect(res.every(p => p.city.toLowerCase().includes('austin'))).toBe(true)
  })
})