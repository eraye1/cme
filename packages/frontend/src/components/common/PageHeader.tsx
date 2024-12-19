import { Group, Title, Button } from '@mantine/core';

interface PageHeaderProps {
  title: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export function PageHeader({ title, action }: PageHeaderProps) {
  return (
    <Group justify="space-between">
      <Title order={1}>{title}</Title>
      {action && (
        <Button onClick={action.onClick}>{action.label}</Button>
      )}
    </Group>
  );
} 