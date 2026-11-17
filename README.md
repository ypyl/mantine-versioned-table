# Versioned items table: TanStack Table + Mantine 9

Live demo: **https://ypyl.github.io/mantine-versioned-table/**

A React table for data where each item has several versions. One switch flips
between two views:

- **Grouped:** one row per item id, filled with the latest version's values.
  Expand the row to see every version, newest first.
- **Flat:** every version as its own row.

TanStack Table owns grouping, aggregation and row expansion. Mantine 9 renders
the table, badges, switch and buttons. There is no third-party Mantine table
wrapper in between.

## Stack

| Area | Choice |
| --- | --- |
| UI | React 19, Mantine 9 |
| Table | TanStack Table v9 (headless) |
| Build | Vite 8, TypeScript |
| Tests | Vitest, Testing Library, jsdom |
| Hosting | GitHub Pages via GitHub Actions |

## Run locally

```bash
npm install
npm run dev        # http://localhost:5173
npm test           # unit and component tests
npm run build      # type check plus production build
npm run preview    # serve the production build
```

## How the grouped view works

The table registers three features and the row models they need:

```ts
const versionedTableFeatures = tableFeatures({
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
```

`aggregationFn_latestVersion` takes the row with the highest `version` and
returns that row's value for the column. Every visible data column uses it:

```ts
helper.accessor('name', {
  header: 'Name',
  aggregationFn: 'latestVersion',
})
```

So a collapsed group row reads exactly like the latest version of that item.
The `Versions` column uses the built-in `count` aggregation, which is why it
shows the number of versions without a separate lookup.

Expansion is a second layer. TanStack creates the group tree, and
`rowExpandingFeature` plus `createExpandedRowModel` flatten the expanded rows
into the rendered model. Items with one version set `getRowCanExpand` to false,
so they get no chevron. Changing the grouping mode clears the expanded state.

## Adapt it to another item shape

The component takes `data: PromptVersion[]`, where `PromptVersion` is defined in
`src/data/prompt-versions.ts`. To use a different record:

1. Replace `PromptVersion` with your type. Keep an item identifier and a numeric
   version field.
2. Update the accessors and cells in
   `src/components/VersionedItemsTable/columns.tsx`.
3. Keep `aggregationFn: 'latestVersion'` on every column that should show the
   latest value. Update `latestVersionNumbers` if the version field changes.
4. If ordering should differ, adjust `sortForDisplay` in `src/domain/versions.ts`.

The component state is intentionally small:

```tsx
<VersionedItemsTable
  data={promptVersions}
  initialGrouped
  onGroupedChange={(grouped) => console.log(grouped)}
/>
```

## Project layout

```
src/
  components/VersionedItemsTable/
    VersionedItemsTable.tsx      table state, toolbar, Mantine markup
    columns.tsx                  column definitions and cell rendering
    table-features.ts            TanStack features and latest-version aggregation
    VersionedItemsTable.test.tsx component tests
  data/prompt-versions.ts        demo data
  domain/versions.ts             sorting, grouping and latest-version helpers
  domain/versions.test.ts        helper tests
  test/setup.ts                  jsdom polyfills and Testing Library cleanup
```

## Deployment

The workflow in `.github/workflows/deploy.yml` runs on every push to `main`:

1. `npm ci`
2. `npm test`
3. `npm run build` with `base` set to `/mantine-versioned-table/`
4. upload `dist` and deploy it to GitHub Pages

GitHub Pages must use the `GitHub Actions` source. The workflow has the
`pages: write` and `id-token: write` permissions it needs.

## License

MIT. See [LICENSE](LICENSE).
