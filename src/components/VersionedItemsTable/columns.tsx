import { ActionIcon, Badge, Box, Group, Text } from '@mantine/core'
import { IconChevronRight } from '@tabler/icons-react'
import { createColumnHelper } from '@tanstack/react-table'
import type { PromptStatus, PromptVersion } from '../../data/prompt-versions'
import { versionedTableFeatures } from './table-features'

const helper = createColumnHelper<typeof versionedTableFeatures, PromptVersion>()

const statusColor: Record<PromptStatus, string> = {
  published: 'teal',
  draft: 'yellow',
  archived: 'gray',
}

const dateFormatter = new Intl.DateTimeFormat('en-GB', {
  day: 'numeric',
  month: 'short',
  year: 'numeric',
})

export const columnWidths: Record<string, number> = {
  itemId: 200,
  version: 140,
  status: 120,
  updatedAt: 140,
  tokens: 100,
  versionCount: 110,
}

export function createColumns(latestByItem: ReadonlyMap<string, number>, grouped: boolean) {
  const columns = helper.columns([
    helper.accessor('itemId', {
      header: 'Item',
      enableGrouping: true,
      aggregationFn: 'latestVersion',
      cell: ({ row, getValue }) => {
        const itemId = String(getValue())

        if (row.getIsGrouped()) {
          return (
            <Group gap={4} wrap="nowrap">
              {row.getCanExpand() ? (
                <ActionIcon
                  variant="subtle"
                  color="gray"
                  size="sm"
                  aria-label={`${row.getIsExpanded() ? 'Collapse' : 'Expand'} ${itemId}`}
                  aria-expanded={row.getIsExpanded()}
                  onClick={row.getToggleExpandedHandler()}
                >
                  <IconChevronRight
                    size={16}
                    style={{
                      transform: row.getIsExpanded() ? 'rotate(90deg)' : undefined,
                      transition: 'transform 150ms ease',
                    }}
                  />
                </ActionIcon>
              ) : (
                <Box w={26} />
              )}
              <Text size="sm" fw={700} ff="monospace">
                {itemId}
              </Text>
            </Group>
          )
        }

        return (
          <Text
            size="sm"
            ff="monospace"
            c={row.depth > 0 ? 'dimmed' : undefined}
            pl={row.depth > 0 ? 'lg' : 0}
          >
            {itemId}
          </Text>
        )
      },
    }),

    helper.accessor('name', {
      header: 'Name',
      aggregationFn: 'latestVersion',
      cell: ({ row, getValue }) => (
        <Text size="sm" fw={row.getIsGrouped() ? 600 : 400}>
          {getValue()}
        </Text>
      ),
    }),

    helper.accessor('version', {
      header: 'Version',
      aggregationFn: 'latestVersion',
      cell: ({ row, getValue }) => {
        const version = getValue()
        const isLatest = latestByItem.get(row.original.itemId) === version

        return (
          <Group gap={6} wrap="nowrap">
            <Badge variant="light" color="gray" radius="sm">
              v{version}
            </Badge>
            {!row.getIsGrouped() && isLatest ? (
              <Badge variant="light" color="teal" radius="sm">
                latest
              </Badge>
            ) : null}
          </Group>
        )
      },
    }),

    helper.accessor('status', {
      header: 'Status',
      aggregationFn: 'latestVersion',
      cell: ({ getValue }) => (
        <Badge variant="light" color={statusColor[getValue()]} radius="sm">
          {getValue()}
        </Badge>
      ),
    }),

    helper.accessor('updatedAt', {
      header: 'Updated',
      aggregationFn: 'latestVersion',
      cell: ({ getValue }) => (
        <Text size="sm" c="dimmed">
          {dateFormatter.format(new Date(`${getValue()}T00:00:00Z`))}
        </Text>
      ),
    }),

    helper.accessor('tokens', {
      header: 'Tokens',
      aggregationFn: 'latestVersion',
      cell: ({ getValue }) => (
        <Text size="sm" ff="monospace" ta="right">
          {getValue().toLocaleString('en-US')}
        </Text>
      ),
    }),
  ])

  const versionsColumn = helper.display({
    id: 'versionCount',
    header: 'Versions',
    aggregationFn: 'count',
    cell: ({ row, getValue }) =>
      row.getIsGrouped() ? (
        <Badge variant="light" color="blue" radius="sm">
          {String(getValue())}
        </Badge>
      ) : null,
  })

  return grouped ? [...columns, versionsColumn] : columns
}

export function alignFor(columnId: string) {
  return columnId === 'tokens' || columnId === 'versionCount' ? 'right' : undefined
}
