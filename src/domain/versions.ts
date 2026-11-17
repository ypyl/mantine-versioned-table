import type { PromptVersion } from '../data/prompt-versions'

/** Item id ascending, then newest version first. Used for both table modes. */
export function sortForDisplay(versions: readonly PromptVersion[]): PromptVersion[] {
  return [...versions].sort(
    (a, b) => a.itemId.localeCompare(b.itemId) || b.version - a.version,
  )
}

/** Highest version number for every item id. */
export function latestVersionNumbers(
  versions: readonly PromptVersion[],
): ReadonlyMap<string, number> {
  const latest = new Map<string, number>()
  for (const item of versions) {
    const current = latest.get(item.itemId)
    if (current === undefined || item.version > current) {
      latest.set(item.itemId, item.version)
    }
  }
  return latest
}

export function countItems(versions: readonly PromptVersion[]): number {
  return new Set(versions.map((item) => item.itemId)).size
}

/**
 * Rows whose item id, name or tags contain the query, case-insensitively. An
 * empty or whitespace-only query keeps every row.
 */
export function filterForSearch(
  versions: readonly PromptVersion[],
  query: string,
): PromptVersion[] {
  const needle = query.trim().toLowerCase()

  if (needle === '') {
    return [...versions]
  }

  return versions.filter(
    (item) =>
      item.itemId.toLowerCase().includes(needle) ||
      item.name.toLowerCase().includes(needle) ||
      item.tags.some((tag) => tag.toLowerCase().includes(needle)),
  )
}

/** Versions per item id, newest first. */
export function groupByItem(
  versions: readonly PromptVersion[],
): Map<string, PromptVersion[]> {
  const groups = new Map<string, PromptVersion[]>()
  for (const item of sortForDisplay(versions)) {
    const group = groups.get(item.itemId)
    if (group) {
      group.push(item)
    } else {
      groups.set(item.itemId, [item])
    }
  }
  return groups
}
