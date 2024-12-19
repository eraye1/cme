import { AppShell, Container, Group, Button, Text } from '@mantine/core';
import { Link } from 'react-router-dom';

export function LandingHeader() {
  return (
    <AppShell.Header>
      <Container size="xl" h="100%">
        <Group h="100%" justify="space-between">
          <Group>
            {/* Add your logo here */}
            <Text size="xl" fw={700}>CME Tracker</Text>
          </Group>

          <Group>
            <Button component={Link} to="/login" variant="light">
              Sign In
            </Button>
            <Button 
              component={Link} 
              to="/signup"
              variant="gradient"
            >
              Get Started
            </Button>
          </Group>
        </Group>
      </Container>
    </AppShell.Header>
  );
} 