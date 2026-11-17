import { Button, Group, Switch, Table, Text } from '@mantine/core'
import { flexRender, useTable, type ExpandedState, type GroupingState } from '@tanstack/react-table'
import { useVirtualizer } from '@tanstack/react-virtual'
import { useMemo, useRef, useState, type ChangeEvent } from 'react'
import type { PromptVersion } from '../../data/prompt-versions'
import { countItems, latestVersionNumbers, sortForDisplay } from '../../domain/versions'
import { alignFor, columnWidths, createColumns } from './columns'
import { versionedTableFeatures } from './table-features'
import classes from './VersionedItemsTable.module.css'

export interface VersionedItemsTableProps {
  data: readonly PromptVersion[]
  initialGrouped?: boolean
  onGroupedChange?: (grouped: boolean) => void
  /**
   * Virtualise the body rows. Defaults to on above `VIRTUALIZE_ABOVE` rows,
   * which keeps the DOM small for large datasets.
   */
  virtualizeRows?: boolean
}

/** Above this many rendered rows the body is virtualised by default. */
const VIRTUALIZE_ABOVE = 200
/** First guess for row height. Real heights are measured as rows appear. */
const ROW_HEIGHT_ESTIMATE = 41
/** Height of the scrollable body when virtualising. */
const VIRTUAL_VIEWPORT_HEIGHT = 560

const getRowId = (row: PromptVersion) => `${row.itemId}@${row.version}`

/**
 * Item versions in two modes:
 *
 * - grouped: one row per item id, showing the latest version. The row expands
 *   to every version of that item.
 * - flat: every version in a single table.
 *
 * TanStack Table owns grouping, aggregation and expansion. Mantine owns all
 * markup and styling. Large datasets render through a fixed-height scroll
 * container and TanStack Virtual, so only the visible rows reach the DOM.
 */
export function VersionedItemsTable({
  data,
  initialGrouped = true,
  onGroupedChange,
  virtualizeRows,
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

  const renderedRows = table.getRowModel().rows
  const virtualize = virtualizeRows ?? renderedRows.length > VIRTUALIZE_ABOVE

  const scrollRef = useRef<HTMLDivElement>(null)
  const virtualizer = useVirtualizer({
    enabled: virtualize,
    count: renderedRows.length,
    getScrollElement: () => scrollRef.current,
    estimateSize: () => ROW_HEIGHT_ESTIMATE,
    overscan: 8,
  })

  const virtualItems = virtualize ? virtualizer.getVirtualItems() : null
  const bodyRows = virtualItems
    ? virtualItems.flatMap((item) => {
        const row = renderedRows[item.index]
        return row ? [{ index: item.index, row }] : []
      })
    : renderedRows.map((row, index) => ({ index, row }))

  const paddingTop = virtualItems?.length ? virtualItems[0].start : 0
  const paddingBottom = virtualItems?.length
    ? virtualizer.getTotalSize() - virtualItems[virtualItems.length - 1].end
    : 0
  const leafColumnCount = table.getAllLeafColumns().length

  const handleGroupedChange = (event: ChangeEvent<HTMLInputElement>) => {
    const nextGrouped = event.currentTarget.checked
    setGrouped(nextGrouped)
    setExpanded({})
    if (scrollRef.current) {
      scrollRef.current.scrollTop = 0
    }
    onGroupedChange?.(nextGrouped)
  }

  const allExpanded = grouped && table.getIsAllRowsExpanded()

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

      <Table.ScrollContainer
        ref={scrollRef}
        type="native"
        minWidth={880}
        maxHeight={virtualize ? VIRTUAL_VIEWPORT_HEIGHT : undefined}
      >
        <Table
          aria-label="Item versions"
          highlightOnHover
          withTableBorder
          withRowBorders
          stickyHeader={virtualize}
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
            {bodyRows.length === 0 ? (
              <Table.Tr>
                <Table.Td colSpan={leafColumnCount}>
                  <Text size="sm" c="dimmed" ta="center" py="md">
                    No items to show.
                  </Text>
                </Table.Td>
              </Table.Tr>
            ) : null}

            {paddingTop > 0 ? <SpacerRow height={paddingTop} colSpan={leafColumnCount} /> : null}

            {bodyRows.map(({ index, row }) => (
              <Table.Tr
                key={row.id}
                data-index={virtualize ? index : undefined}
                ref={virtualize ? virtualizer.measureElement : undefined}
                className={row.getIsGrouped() ? classes.groupRow : undefined}
              >
                {row.getAllCells().map((cell) => (
                  <Table.Td key={cell.id} ta={alignFor(cell.column.id)}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </Table.Td>
                ))}
              </Table.Tr>
            ))}

            {paddingBottom > 0 ? (
              <SpacerRow height={paddingBottom} colSpan={leafColumnCount} />
            ) : null}
          </Table.Tbody>
        </Table>
      </Table.ScrollContainer>
    </>
  )
}

/** Keeps the scroll height honest while the virtual window moves. */
function SpacerRow({ height, colSpan }: { height: number; colSpan: number }) {
  return (
    <Table.Tr aria-hidden style={{ height, border: 0 }}>
      <Table.Td colSpan={colSpan} style={{ padding: 0, border: 0 }} />
    </Table.Tr>
  )
}
