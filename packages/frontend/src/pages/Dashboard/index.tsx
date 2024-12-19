import { Grid, Stack, Title } from '@mantine/core';
import { CreditsSummary } from './CreditsSummary';
import { UpcomingDeadlines } from './UpcomingDeadlines';
import { RecentActivity } from './RecentActivity';

export function Dashboard() {
  return (
    <Stack>
      <Title order={1}>Dashboard</Title>
      <Grid>
        <Grid.Col span={{ base: 12, md: 6 }}>
          <CreditsSummary />
        </Grid.Col>
        <Grid.Col span={{ base: 12, md: 6 }}>
          <UpcomingDeadlines />
        </Grid.Col>
        <Grid.Col span={12}>
          <RecentActivity />
        </Grid.Col>
      </Grid>
    </Stack>
  );
} 