import { describe, expect, it } from 'vitest'
import { formatPhone, titleCase } from '@/lib/format'

describe('titleCase', () => {
  it('handles apostrophes, hyphens and small words', () => {
    expect(titleCase("JOE'S PIZZA OF THE VILLAGE")).toBe("Joe's Pizza of the Village")
    expect(titleCase('  KABAB   CAFE ')).toBe('Kabab Cafe')
    expect(titleCase('164-02 69 AVENUE')).toBe('164-02 69 Avenue')
  })
})

describe('formatPhone', () => {
  it('formats 10 and 11 digit numbers and rejects junk', () => {
    expect(formatPhone('7183801172')).toBe('(718) 380-1172')
    expect(formatPhone('17183801172')).toBe('(718) 380-1172')
    expect(formatPhone('__________')).toBeUndefined()
    expect(formatPhone('0000000000')).toBeUndefined()
  })
})
