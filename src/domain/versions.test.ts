import { describe, expect, it } from 'vitest'
import { promptVersions } from '../data/prompt-versions'
import {
  countItems,
  filterForSearch,
  groupByItem,
  latestVersionNumbers,
  sortForDisplay,
} from './versions'

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

  it('filters by item id, case-insensitively', () => {
    const matched = filterForSearch(promptVersions, 'PRM-003')

    expect(new Set(matched.map((item) => item.itemId))).toEqual(new Set(['prm-003']))
    expect(matched).toHaveLength(2)
  })

  it('filters by name, keeping every version of a match', () => {
    const matched = filterForSearch(promptVersions, 'invoice')

    expect(new Set(matched.map((item) => item.itemId))).toEqual(new Set(['prm-002']))
    expect(countItems(matched)).toBe(1)
  })

  it('keeps every row for a blank query', () => {
    expect(filterForSearch(promptVersions, '')).toHaveLength(promptVersions.length)
    expect(filterForSearch(promptVersions, '   ')).toHaveLength(promptVersions.length)
  })

  it('returns nothing when no item matches', () => {
    expect(filterForSearch(promptVersions, 'zzz')).toEqual([])
  })
})
