import { Button, Group, Stack, Title } from '@mantine/core';
import { CreditsList } from './CreditsList';
import { AddCreditModal } from './AddCreditModal';
import { useDisclosure } from '@mantine/hooks';

export function Credits() {
  const [modalOpened, { open, close }] = useDisclosure(false);

  return (
    <Stack>
      <Group justify="space-between">
        <Title order={1}>CME Credits</Title>
        <Button onClick={open}>Add Credit</Button>
      </Group>
      <CreditsList />
      <AddCreditModal opened={modalOpened} onClose={close} />
    </Stack>
  );
} 