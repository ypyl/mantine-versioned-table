export type PromptStatus = 'published' | 'draft' | 'archived'

export interface PromptVersion {
  itemId: string
  name: string
  version: number
  status: PromptStatus
  updatedAt: string
  tokens: number
  tags: string[]
}

/**
 * Demo data: eight prompt templates, 21 versions in total.
 * Versions of the same item keep the same name, which makes grouping visible.
 */
export const promptVersions: PromptVersion[] = [
  { itemId: 'prm-001', name: 'Support triage', version: 1, status: 'archived', updatedAt: '2026-02-11', tokens: 640, tags: ['support', 'triage'] },
  { itemId: 'prm-001', name: 'Support triage', version: 2, status: 'archived', updatedAt: '2026-04-02', tokens: 720, tags: ['support', 'triage'] },
  { itemId: 'prm-001', name: 'Support triage', version: 3, status: 'published', updatedAt: '2026-06-19', tokens: 910, tags: ['support', 'triage', 'routing'] },
  { itemId: 'prm-001', name: 'Support triage', version: 4, status: 'published', updatedAt: '2026-09-08', tokens: 980, tags: ['support', 'triage', 'routing'] },

  { itemId: 'prm-002', name: 'Invoice extraction', version: 1, status: 'archived', updatedAt: '2026-01-23', tokens: 512, tags: ['billing', 'extraction'] },
  { itemId: 'prm-002', name: 'Invoice extraction', version: 2, status: 'published', updatedAt: '2026-05-14', tokens: 640, tags: ['billing', 'extraction'] },
  { itemId: 'prm-002', name: 'Invoice extraction', version: 3, status: 'draft', updatedAt: '2026-10-01', tokens: 705, tags: ['billing', 'extraction', 'ocr'] },

  { itemId: 'prm-003', name: 'Meeting summary', version: 1, status: 'published', updatedAt: '2026-03-30', tokens: 420, tags: ['meetings', 'summary'] },
  { itemId: 'prm-003', name: 'Meeting summary', version: 2, status: 'published', updatedAt: '2026-07-21', tokens: 455, tags: ['meetings', 'summary', 'actions'] },

  { itemId: 'prm-004', name: 'Code review checklist', version: 1, status: 'published', updatedAt: '2026-08-12', tokens: 380, tags: ['code-review', 'quality'] },

  { itemId: 'prm-005', name: 'Customer email rewrite', version: 1, status: 'archived', updatedAt: '2026-02-27', tokens: 300, tags: ['email', 'support'] },
  { itemId: 'prm-005', name: 'Customer email rewrite', version: 2, status: 'published', updatedAt: '2026-06-05', tokens: 340, tags: ['email', 'support'] },
  { itemId: 'prm-005', name: 'Customer email rewrite', version: 3, status: 'published', updatedAt: '2026-09-25', tokens: 365, tags: ['email', 'support', 'tone'] },

  { itemId: 'prm-006', name: 'SQL explainer', version: 1, status: 'draft', updatedAt: '2026-10-11', tokens: 520, tags: ['sql', 'docs'] },
  { itemId: 'prm-006', name: 'SQL explainer', version: 2, status: 'draft', updatedAt: '2026-10-19', tokens: 560, tags: ['sql', 'docs'] },

  { itemId: 'prm-007', name: 'Release notes writer', version: 1, status: 'archived', updatedAt: '2026-01-09', tokens: 700, tags: ['docs', 'release'] },
  { itemId: 'prm-007', name: 'Release notes writer', version: 2, status: 'archived', updatedAt: '2026-03-18', tokens: 760, tags: ['docs', 'release'] },
  { itemId: 'prm-007', name: 'Release notes writer', version: 3, status: 'published', updatedAt: '2026-08-04', tokens: 820, tags: ['docs', 'release', 'changelog'] },
  { itemId: 'prm-007', name: 'Release notes writer', version: 4, status: 'draft', updatedAt: '2026-10-22', tokens: 870, tags: ['docs', 'release', 'changelog'] },

  { itemId: 'prm-008', name: 'Ticket classifier', version: 1, status: 'published', updatedAt: '2026-04-16', tokens: 280, tags: ['classification', 'support'] },
  { itemId: 'prm-008', name: 'Ticket classifier', version: 2, status: 'published', updatedAt: '2026-09-02', tokens: 310, tags: ['classification', 'support', 'routing'] },
]

const generatedStatuses: PromptStatus[] = ['published', 'draft', 'archived', 'published']

/** Tag sets cycled through the generated items. */
const generatedTags: string[][] = [
  ['support', 'triage'],
  ['billing', 'extraction'],
  ['meetings', 'summary'],
  ['code-review', 'quality'],
  ['email', 'support'],
  ['sql', 'docs'],
  ['docs', 'release'],
  ['classification', 'support', 'routing'],
]

/**
 * Deterministic dataset of the same shape as `promptVersions`, used by the demo
 * size selector to show what the table does with a few thousand rows.
 * Four versions per item, so `versionCount` rows become `versionCount / 4` items.
 */
export function createPromptVersions(versionCount: number): PromptVersion[] {
  const versions: PromptVersion[] = []

  for (let index = 0; index < versionCount; index += 1) {
    const itemNumber = Math.floor(index / 4) + 1
    const version = (index % 4) + 1
    const month = String(1 + ((index * 5) % 12)).padStart(2, '0')
    const day = String(1 + ((index * 7) % 28)).padStart(2, '0')

    versions.push({
      itemId: `prm-${String(itemNumber).padStart(3, '0')}`,
      name: `Prompt template ${itemNumber}`,
      version,
      status: generatedStatuses[version % generatedStatuses.length],
      updatedAt: `2026-${month}-${day}`,
      tokens: 320 + ((index * 37) % 640),
      tags: generatedTags[itemNumber % generatedTags.length],
    })
  }

  return versions
}
