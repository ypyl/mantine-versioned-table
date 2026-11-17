import { describe, expect, it } from 'vitest'
import { createPromptVersions, promptVersions } from './prompt-versions'
import { countItems } from '../domain/versions'

describe('createPromptVersions', () => {
  it('builds four versions per item', () => {
    const data = createPromptVersions(2000)

    expect(data).toHaveLength(2000)
    expect(countItems(data)).toBe(500)
    expect(data.slice(0, 4).map((item) => item.version)).toEqual([1, 2, 3, 4])
    expect(data[3].itemId).toBe('prm-001')
    expect(data[4].itemId).toBe('prm-002')
  })

  it('is deterministic and produces unique row ids', () => {
    const first = createPromptVersions(200)
    const second = createPromptVersions(200)

    expect(first).toEqual(second)
    expect(new Set(first.map((row) => `${row.itemId}@${row.version}`)).size).toBe(200)
  })

  it('matches the shape of the hand-written demo data', () => {
    const generated = createPromptVersions(promptVersions.length)

    expect(generated).toHaveLength(promptVersions.length)
    expect(Object.keys(generated[0]).sort()).toEqual(Object.keys(promptVersions[0]).sort())
    for (const row of generated) {
      expect(row.updatedAt).toMatch(/^2026-\d{2}-\d{2}$/)
      expect(row.tokens).toBeGreaterThan(0)
    }
  })
})
