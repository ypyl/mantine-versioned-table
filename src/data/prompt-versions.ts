export type PromptStatus = 'published' | 'draft' | 'archived'

export interface PromptVersion {
  itemId: string
  name: string
  version: number
  status: PromptStatus
  updatedAt: string
  tokens: number
}

/**
 * Demo data: eight prompt templates, 21 versions in total.
 * Versions of the same item keep the same name, which makes grouping visible.
 */
export const promptVersions: PromptVersion[] = [
  { itemId: 'prm-001', name: 'Support triage', version: 1, status: 'archived', updatedAt: '2026-02-11', tokens: 640 },
  { itemId: 'prm-001', name: 'Support triage', version: 2, status: 'archived', updatedAt: '2026-04-02', tokens: 720 },
  { itemId: 'prm-001', name: 'Support triage', version: 3, status: 'published', updatedAt: '2026-06-19', tokens: 910 },
  { itemId: 'prm-001', name: 'Support triage', version: 4, status: 'published', updatedAt: '2026-09-08', tokens: 980 },

  { itemId: 'prm-002', name: 'Invoice extraction', version: 1, status: 'archived', updatedAt: '2026-01-23', tokens: 512 },
  { itemId: 'prm-002', name: 'Invoice extraction', version: 2, status: 'published', updatedAt: '2026-05-14', tokens: 640 },
  { itemId: 'prm-002', name: 'Invoice extraction', version: 3, status: 'draft', updatedAt: '2026-10-01', tokens: 705 },

  { itemId: 'prm-003', name: 'Meeting summary', version: 1, status: 'published', updatedAt: '2026-03-30', tokens: 420 },
  { itemId: 'prm-003', name: 'Meeting summary', version: 2, status: 'published', updatedAt: '2026-07-21', tokens: 455 },

  { itemId: 'prm-004', name: 'Code review checklist', version: 1, status: 'published', updatedAt: '2026-08-12', tokens: 380 },

  { itemId: 'prm-005', name: 'Customer email rewrite', version: 1, status: 'archived', updatedAt: '2026-02-27', tokens: 300 },
  { itemId: 'prm-005', name: 'Customer email rewrite', version: 2, status: 'published', updatedAt: '2026-06-05', tokens: 340 },
  { itemId: 'prm-005', name: 'Customer email rewrite', version: 3, status: 'published', updatedAt: '2026-09-25', tokens: 365 },

  { itemId: 'prm-006', name: 'SQL explainer', version: 1, status: 'draft', updatedAt: '2026-10-11', tokens: 520 },
  { itemId: 'prm-006', name: 'SQL explainer', version: 2, status: 'draft', updatedAt: '2026-10-19', tokens: 560 },

  { itemId: 'prm-007', name: 'Release notes writer', version: 1, status: 'archived', updatedAt: '2026-01-09', tokens: 700 },
  { itemId: 'prm-007', name: 'Release notes writer', version: 2, status: 'archived', updatedAt: '2026-03-18', tokens: 760 },
  { itemId: 'prm-007', name: 'Release notes writer', version: 3, status: 'published', updatedAt: '2026-08-04', tokens: 820 },
  { itemId: 'prm-007', name: 'Release notes writer', version: 4, status: 'draft', updatedAt: '2026-10-22', tokens: 870 },

  { itemId: 'prm-008', name: 'Ticket classifier', version: 1, status: 'published', updatedAt: '2026-04-16', tokens: 280 },
  { itemId: 'prm-008', name: 'Ticket classifier', version: 2, status: 'published', updatedAt: '2026-09-02', tokens: 310 },
]
