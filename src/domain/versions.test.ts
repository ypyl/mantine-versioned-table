import { describe, expect, it } from 'vitest'
import { promptVersions } from '../data/prompt-versions'
import { countItems, groupByItem, latestVersionNumbers, sortForDisplay } from './versions'

describe('version helpers', () => {
  it('has one unique row per item id and version', () => {
    const keys = promptVersions.map((item) => `${item.itemId}@${item.version}`)
    expect(new Set(keys).size).toBe(promptVersions.length)
  })

  it('finds the latest version number for each item', () => {
    const latest = latestVersionNumbers(promptVersions)

    expect(latest.get('prm-001')).toBe(4)
    expect(latest.get('prm-002')).toBe(3)
    expect(latest.get('prm-004')).toBe(1)
    expect(latest.size).toBe(8)
  })

  it('counts distinct items, not rows', () => {
    expect(countItems(promptVersions)).toBe(8)
    expect(promptVersions).toHaveLength(21)
  })

  it('sorts by item id and newest version first', () => {
    const sorted = sortForDisplay(promptVersions)

    expect(sorted[0]).toMatchObject({ itemId: 'prm-001', version: 4 })
    expect(sorted[1]).toMatchObject({ itemId: 'prm-001', version: 3 })
    expect(sorted.at(-1)).toMatchObject({ itemId: 'prm-008', version: 1 })
  })

  it('groups every row under its item id', () => {
    const groups = groupByItem(promptVersions)

    expect(groups.size).toBe(8)
    expect(groups.get('prm-007')?.map((item) => item.version)).toEqual([4, 3, 2, 1])
    expect([...groups.values()].flat()).toHaveLength(promptVersions.length)
  })
})
