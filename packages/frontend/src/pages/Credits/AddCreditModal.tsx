import { Modal, Button, Stack } from '@mantine/core';
import { CreditForm } from '../../components/forms/CreditForm';

interface AddCreditModalProps {
  opened: boolean;
  onClose: () => void;
}

export function AddCreditModal({ opened, onClose }: AddCreditModalProps) {
  return (
    <Modal opened={opened} onClose={onClose} title="Add CME Credit">
      <Stack>
        <CreditForm />
        <Button onClick={onClose}>Cancel</Button>
      </Stack>
    </Modal>
  );
} 