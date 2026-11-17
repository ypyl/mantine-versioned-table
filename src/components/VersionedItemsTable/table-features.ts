import {
  aggregationFn_count,
  columnGroupingFeature,
  constructAggregationFn,
  createExpandedRowModel,
  createGroupedRowModel,
  rowAggregationFeature,
  rowExpandingFeature,
  tableFeatures,
} from '@tanstack/react-table'
import type { PromptVersion } from '../../data/prompt-versions'

/**
 * Aggregation used when rows are grouped by item id: take the value from the
 * row with the highest version number. Every visible column opts into it, so a
 * collapsed group row reads exactly like its latest version.
 */
export const aggregationFn_latestVersion = constructAggregationFn<
  // The registry is shared by all tables, so features and values stay generic.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  any,
  PromptVersion,
  unknown,
  unknown
>({
  aggregate: ({ rows, getValue }) => {
    if (rows.length === 0) {
      return undefined
    }

    const latest = rows.reduce((newest, row) =>
      row.original.version > newest.original.version ? row : newest,
    )

    return getValue(latest)
  },
})

/**
 * Feature set for the versioned items table. Only the slots that the component
 * uses are registered: grouping, aggregation and row expansion.
 */
export const versionedTableFeatures = tableFeatures({
  columnGroupingFeature,
  rowAggregationFeature,
  rowExpandingFeature,
  groupedRowModel: createGroupedRowModel(),
  expandedRowModel: createExpandedRowModel(),
  aggregationFns: {
    latestVersion: aggregationFn_latestVersion,
    count: aggregationFn_count,
  },
})
