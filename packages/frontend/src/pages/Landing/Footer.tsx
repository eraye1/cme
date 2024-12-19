import { AppShell, Container, Group, Text, Stack } from '@mantine/core';

export function LandingFooter() {
  return (
    <AppShell.Footer>
      <Container size="xl" py="xl">
        <Stack gap="md">
          <Group justify="space-between">
            <Text size="sm" c="dimmed">
              © 2024 CME Tracker. All rights reserved.
            </Text>
            <Group gap="lg">
              <Text component="a" href="#" size="sm">
                Terms of Service
              </Text>
              <Text component="a" href="#" size="sm">
                Privacy Policy
              </Text>
              <Text component="a" href="#" size="sm">
                Contact
              </Text>
            </Group>
          </Group>
        </Stack>
      </Container>
    </AppShell.Footer>
  );
} 