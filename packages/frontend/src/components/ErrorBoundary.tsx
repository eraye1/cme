import React from 'react';
import { Container, Title, Text, Button, Stack } from '@mantine/core';

interface Props {
  children: React.ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <Container size="sm" py="xl">
          <Stack align="center" spacing="md">
            <Title>Something went wrong</Title>
            <Text>{this.state.error?.message}</Text>
            <Button onClick={() => window.location.reload()}>
              Reload page
            </Button>
          </Stack>
        </Container>
      );
    }

    return this.props.children;
  }
} 