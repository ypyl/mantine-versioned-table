import { Button, Group, Switch, Table, Text } from '@mantine/core'
import { flexRender, useTable, type ExpandedState, type GroupingState } from '@tanstack/react-table'
import { useMemo, useState, type ChangeEvent } from 'react'
import type { PromptVersion } from '../../data/prompt-versions'
import { countItems, latestVersionNumbers, sortForDisplay } from '../../domain/versions'
import { alignFor, columnWidths, createColumns } from './columns'
import { versionedTableFeatures } from './table-features'
import classes from './VersionedItemsTable.module.css'

export interface VersionedItemsTableProps {
  data: readonly PromptVersion[]
  initialGrouped?: boolean
  onGroupedChange?: (grouped: boolean) => void
}

const getRowId = (row: PromptVersion) => `${row.itemId}@${row.version}`

/**
 * Item versions in two modes:
 *
 * - grouped: one row per item id, showing the latest version. The row expands
 *   to every version of that item.
 * - flat: every version in a single table.
 *
 * TanStack Table owns grouping, aggregation and expansion. Mantine owns all
 * markup and styling.
 */
export function VersionedItemsTable({
  data,
  initialGrouped = true,
  onGroupedChange,
}: VersionedItemsTableProps) {
  const [grouped, setGrouped] = useState(initialGrouped)
  const [expanded, setExpanded] = useState<ExpandedState>({})

  const rows = useMemo(() => sortForDisplay(data), [data])
  const latestByItem = useMemo(() => latestVersionNumbers(data), [data])
  const itemCount = useMemo(() => countItems(data), [data])

  const columns = useMemo(() => createColumns(latestByItem, grouped), [latestByItem, grouped])
  const grouping = useMemo<GroupingState>(() => (grouped ? ['itemId'] : []), [grouped])

  const table = useTable({
    features: versionedTableFeatures,
    columns,
    data: rows,
    getRowId,
    getRowCanExpand: (row) => row.subRows.length > 1,
    state: { grouping, expanded },
    onExpandedChange: setExpanded,
  })

  const handleGroupedChange = (event: ChangeEvent<HTMLInputElement>) => {
    const nextGrouped = event.currentTarget.checked
    setGrouped(nextGrouped)
    setExpanded({})
    onGroupedChange?.(nextGrouped)
  }

  const allExpanded = grouped && table.getIsAllRowsExpanded()
  const renderedRows = table.getRowModel().rows

  const toggleAllGroups = () => {
    if (allExpanded) {
      setExpanded({})
      return
    }

    const nextExpanded: Record<string, boolean> = {}
    for (const row of table.getRowModel().rows) {
      if (row.getCanExpand()) {
        nextExpanded[row.id] = true
      }
    }
    setExpanded(nextExpanded)
  }

  return (
    <>
      <Group justify="space-between" align="center" gap="sm" mb="sm">
        <Group gap={6}>
          <Text size="sm" fw={600}>
            {itemCount} items
          </Text>
          <Text size="sm" c="dimmed">
            ·
          </Text>
          <Text size="sm" c="dimmed">
            {data.length} versions
          </Text>
          {grouped ? (
            <>
              <Text size="sm" c="dimmed">
                ·
              </Text>
              <Text size="sm" c="dimmed">
                latest version per item
              </Text>
            </>
          ) : null}
        </Group>

        <Group gap="sm">
          {grouped ? (
            <Button
              variant="default"
              size="xs"
              onClick={toggleAllGroups}
            >
              {allExpanded ? 'Collapse all' : 'Expand all'}
            </Button>
          ) : null}
          <Switch
            size="sm"
            checked={grouped}
            onChange={handleGroupedChange}
            label="Group by item"
          />
        </Group>
      </Group>

      <Table.ScrollContainer minWidth={880}>
        <Table
          aria-label="Item versions"
          highlightOnHover
          withTableBorder
          withRowBorders
          verticalSpacing="xs"
          horizontalSpacing="md"
        >
          <Table.Thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <Table.Tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <Table.Th
                    key={header.id}
                    w={columnWidths[header.column.id]}
                    ta={alignFor(header.column.id)}
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(header.column.columnDef.header, header.getContext())}
                  </Table.Th>
                ))}
              </Table.Tr>
            ))}
          </Table.Thead>

          <Table.Tbody>
            {renderedRows.length === 0 ? (
              <Table.Tr>
                <Table.Td colSpan={table.getAllLeafColumns().length}>
                  <Text size="sm" c="dimmed" ta="center" py="md">
                    No items to show.
                  </Text>
                </Table.Td>
              </Table.Tr>
            ) : null}

            {renderedRows.map((row) => (
              <Table.Tr
                key={row.id}
                className={row.getIsGrouped() ? classes.groupRow : undefined}
              >
                {row.getAllCells().map((cell) => (
                  <Table.Td key={cell.id} ta={alignFor(cell.column.id)}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </Table.Td>
                ))}
              </Table.Tr>
            ))}
          </Table.Tbody>
        </Table>
      </Table.ScrollContainer>
    </>
  )
}
