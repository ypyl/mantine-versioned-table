import {
  ActionIcon,
  Anchor,
  Container,
  Group,
  List,
  Paper,
  SegmentedControl,
  Stack,
  Text,
  Title,
  useComputedColorScheme,
  useMantineColorScheme,
} from '@mantine/core'
import { IconBrandGithub, IconMoon, IconSun } from '@tabler/icons-react'
import { useMemo, useState } from 'react'
import { VersionedItemsTable } from './components/VersionedItemsTable/VersionedItemsTable'
import { createPromptVersions, promptVersions } from './data/prompt-versions'
import { countItems } from './domain/versions'

const repositoryUrl = 'https://github.com/ypyl/mantine-versioned-table'

/** Choices offered by the dataset size switcher: versions, not items. */
const datasetSizes = [
  { value: '21', label: '21' },
  { value: '500', label: '500' },
  { value: '2000', label: '2 000' },
]

export default function App() {
  const { setColorScheme } = useMantineColorScheme()
  const colorScheme = useComputedColorScheme('light', { getInitialValueInEffect: true })
  const [datasetSize, setDatasetSize] = useState('2000')

  const data = useMemo(
    () => (datasetSize === '21' ? promptVersions : createPromptVersions(Number(datasetSize))),
    [datasetSize],
  )

  return (
    <Container size="lg" py={{ base: 'lg', sm: 'xl' }}>
      <Stack gap="lg">
        <Group justify="space-between" align="flex-start" gap="md">
          <Stack gap={4}>
            <Title order={1} size="h2">
              Versioned items
            </Title>
            <Text c="dimmed" size="sm">
              {countItems(data)} prompt templates, {data.length} versions. Grouped and flat
              views from the same TanStack Table model.
            </Text>
          </Stack>

          <Group gap="xs" align="center">
            <Text size="xs" c="dimmed">
              Versions
            </Text>
            <SegmentedControl
              size="xs"
              value={datasetSize}
              onChange={setDatasetSize}
              data={datasetSizes}
              aria-label="Dataset size in versions"
            />
            <ActionIcon
              component="a"
              href={repositoryUrl}
              target="_blank"
              rel="noreferrer"
              variant="default"
              size="lg"
              aria-label="Open the GitHub repository"
            >
              <IconBrandGithub size={18} />
            </ActionIcon>
            <ActionIcon
              variant="default"
              size="lg"
              aria-label="Toggle color scheme"
              onClick={() => setColorScheme(colorScheme === 'dark' ? 'light' : 'dark')}
            >
              {colorScheme === 'dark' ? <IconSun size={18} /> : <IconMoon size={18} />}
            </ActionIcon>
          </Group>
        </Group>

        <Paper withBorder radius="md" p={{ base: 'sm', sm: 'md' }}>
          <VersionedItemsTable data={data} />
        </Paper>

        <Paper withBorder radius="md" p={{ base: 'sm', sm: 'md' }}>
          <Stack gap="xs">
            <Title order={2} size="h4">
              How it works
            </Title>
            <List size="sm" spacing={4}>
              <List.Item>
                Grouping by <code>itemId</code> creates one row per item. Aggregation fills
                that row with values from the highest version, so it reads like the latest
                version without a separate query.
              </List.Item>
              <List.Item>
                Expanding a group reveals every version of that item, newest first. Items
                with a single version do not get a chevron.
              </List.Item>
              <List.Item>
                Turning the switch off clears the grouping state. The same table then
                renders every version as a flat row.
              </List.Item>
              <List.Item>
                The search box matches item ids and names before grouping, so a hit on an
                old version keeps the whole item. Counts switch to "N of M" while it is
                active.
              </List.Item>
              <List.Item>
                Past 200 rendered rows the body is virtualised: the rows live in a
                fixed-height scroll container and TanStack Virtual keeps only the visible
                window in the DOM, so 2 000 versions scroll the same as 21.
              </List.Item>
              <List.Item>
                TanStack Table provides grouping, aggregation and expansion. Mantine 9
                renders the table, badges, switch and buttons.
              </List.Item>
            </List>
          </Stack>
        </Paper>

        <Text size="sm" c="dimmed">
          Built with React 19, Mantine 9 and TanStack Table v9. Source and instructions on{' '}
          <Anchor href={repositoryUrl} target="_blank" rel="noreferrer">
            GitHub
          </Anchor>
          .
        </Text>
      </Stack>
    </Container>
  )
}
