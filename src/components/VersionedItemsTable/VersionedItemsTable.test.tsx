import { MantineProvider } from '@mantine/core'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { promptVersions } from '../../data/prompt-versions'
import { VersionedItemsTable } from './VersionedItemsTable'

function renderTable(data = promptVersions) {
  const user = userEvent.setup()
  render(
    <MantineProvider>
      <VersionedItemsTable data={data} />
    </MantineProvider>,
  )
  return user
}

describe('VersionedItemsTable', () => {
  it('shows one collapsed row per item with the latest version values', () => {
    renderTable()

    // Header row plus eight item groups.
    expect(screen.getAllByRole('row')).toHaveLength(9)

    const first = screen.getByText('prm-001').closest('tr')
    expect(first).not.toBeNull()
    expect(within(first!).getByText('v4')).toBeInTheDocument()
    expect(within(first!).queryByText('v3')).not.toBeInTheDocument()
    expect(within(first!).getByText('980')).toBeInTheDocument()
    expect(within(first!).getByText('4')).toBeInTheDocument()
  })

  it('aggregates every column from the newest version', () => {
    renderTable()

    const draftItem = screen.getByText('prm-002').closest('tr')
    expect(draftItem).not.toBeNull()
    expect(within(draftItem!).getByText('v3')).toBeInTheDocument()
    expect(within(draftItem!).getByText('draft')).toBeInTheDocument()
    expect(within(draftItem!).getByText('705')).toBeInTheDocument()
    expect(within(draftItem!).queryByText('published')).not.toBeInTheDocument()
  })

  it('expands one group and shows all of its versions', async () => {
    const user = renderTable()

    await user.click(screen.getByRole('button', { name: 'Expand prm-001' }))

    const rows = screen.getAllByRole('row')
    // Header, eight groups, and the four versions of prm-001.
    expect(rows).toHaveLength(13)

    expect(within(rows[2]!).getByText('v4')).toBeInTheDocument()
    expect(within(rows[2]!).getByText('latest')).toBeInTheDocument()
    expect(within(rows[3]!).getByText('v3')).toBeInTheDocument()
    expect(within(rows[4]!).getByText('v2')).toBeInTheDocument()
    expect(within(rows[5]!).getByText('v1')).toBeInTheDocument()
  })

  it('does not offer expansion for a single-version item', () => {
    renderTable()

    expect(
      screen.queryByRole('button', { name: 'Expand prm-004' }),
    ).not.toBeInTheDocument()
    expect(screen.getByText('prm-004')).toBeInTheDocument()
  })

  it('switches to a flat table with every version', async () => {
    const user = renderTable()

    await user.click(screen.getByRole('switch', { name: /group by item/i }))

    expect(screen.getByRole('switch', { name: /group by item/i })).not.toBeChecked()
    expect(screen.queryByRole('button', { name: /^Expand/ })).not.toBeInTheDocument()
    expect(screen.getAllByRole('row')).toHaveLength(promptVersions.length + 1)
    expect(screen.getAllByText('latest')).toHaveLength(8)
    expect(screen.getAllByText('v1')).toHaveLength(8)
  })

  it('expands and collapses every group', async () => {
    const user = renderTable()

    await user.click(screen.getByRole('button', { name: 'Expand all' }))
    // Header, eight groups and 20 child rows (prm-004 has one version only).
    expect(screen.getAllByRole('row')).toHaveLength(1 + 8 + 20)

    await user.click(screen.getByRole('button', { name: 'Collapse all' }))
    expect(screen.getAllByRole('row')).toHaveLength(9)
  })

  it('shows an empty state when there is no data', () => {
    renderTable([])

    expect(screen.getByText('No items to show.')).toBeInTheDocument()
    expect(screen.getAllByRole('row')).toHaveLength(2)
  })

  it('searches by item id and by name', async () => {
    const user = renderTable()
    const search = screen.getByRole('textbox', { name: 'Search by item id or name' })

    await user.type(search, 'PRM-003')
    expect(screen.getByText('prm-003')).toBeInTheDocument()
    expect(screen.queryByText('prm-001')).not.toBeInTheDocument()
    expect(screen.getByText('1 of 8 items')).toBeInTheDocument()
    expect(screen.getByText('2 of 21 versions')).toBeInTheDocument()

    await user.clear(search)
    await user.type(search, 'invoice')
    expect(screen.getByText('prm-002')).toBeInTheDocument()
    expect(screen.queryByText('prm-003')).not.toBeInTheDocument()
  })

  it('reports when a search matches nothing and clears back to the full list', async () => {
    const user = renderTable()
    const search = screen.getByRole('textbox', { name: 'Search by item id or name' })

    await user.type(search, 'zzz')
    expect(screen.getByText('No items match "zzz".')).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Clear search' }))
    expect(search).toHaveValue('')
    expect(screen.getAllByRole('row')).toHaveLength(9)
  })
})
