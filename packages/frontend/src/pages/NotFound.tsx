import { Container, Title, Text, Button, Group } from '@mantine/core';
import { Link } from 'react-router-dom';

export function NotFound() {
  return (
    <Container py={80}>
      <Title order={1}>404 - Page Not Found</Title>
      <Text c="dimmed" size="lg" mt="md">
        The page you are looking for doesn't exist or has been moved.
      </Text>
      <Group mt="xl">
        <Button component={Link} to="/" variant="outline">
          Go to Home
        </Button>
        <Button component={Link} to="/app">
          Go to Dashboard
        </Button>
      </Group>
    </Container>
  );
} 