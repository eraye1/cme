import { Modal, TextInput, NumberInput, Select, Button, Stack, Group, Textarea } from '@mantine/core';
import { DateInput } from '@mantine/dates';
import { useForm } from '@mantine/form';
import { ActivityType, CreditCategory } from '../../types';

interface DocumentEditModalProps {
  opened: boolean;
  onClose: () => void;
  onSave: (values: DocumentFormValues) => Promise<void>;
  initialData?: Partial<DocumentFormValues>;
  documentId: string;
}

interface DocumentFormValues {
  title: string;
  provider: string;
  credits: number | null;
  completedDate: Date | null;
  category: CreditCategory | null;
  activityType: ActivityType | null;
  expirationDate: Date | null;
  description: string;
  notes: string;
}

export function DocumentEditModal({ 
  opened, 
  onClose, 
  onSave, 
  initialData,
  documentId 
}: DocumentEditModalProps) {
  const form = useForm<DocumentFormValues>({
    initialValues: {
      title: initialData?.title || '',
      provider: initialData?.provider || '',
      credits: initialData?.credits || null,
      completedDate: initialData?.completedDate ? new Date(initialData.completedDate) : null,
      category: initialData?.category || null,
      activityType: initialData?.activityType || null,
      expirationDate: initialData?.expirationDate ? new Date(initialData.expirationDate) : null,
      description: initialData?.description || '',
      notes: initialData?.notes || '',
    },
  });

  const handleSubmit = async (values: DocumentFormValues) => {
    try {
      await onSave(values);
      onClose();
    } catch (error) {
      console.error('Error saving document:', error);
    }
  };

  return (
    <Modal 
      opened={opened} 
      onClose={onClose}
      title="Edit Document Details"
      size="lg"
    >
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <Stack>
          <TextInput
            label="Title"
            placeholder="Activity title"
            {...form.getInputProps('title')}
          />
          
          <TextInput
            label="Provider"
            placeholder="Provider name"
            {...form.getInputProps('provider')}
          />

          <NumberInput
            label="Credits"
            placeholder="Number of credits"
            min={0}
            {...form.getInputProps('credits')}
          />

          <Select
            label="Category"
            placeholder="Select category"
            data={Object.values(CreditCategory)}
            {...form.getInputProps('category')}
          />

          <Select
            label="Activity Type"
            placeholder="Select activity type"
            data={Object.values(ActivityType)}
            {...form.getInputProps('activityType')}
          />

          <DateInput
            label="Completion Date"
            placeholder="When did you complete this activity?"
            {...form.getInputProps('completedDate')}
          />

          <DateInput
            label="Expiration Date"
            placeholder="When does this expire? (optional)"
            {...form.getInputProps('expirationDate')}
          />

          <Textarea
            label="Description"
            placeholder="Activity description"
            {...form.getInputProps('description')}
          />

          <Textarea
            label="Notes"
            placeholder="Additional notes"
            {...form.getInputProps('notes')}
          />

          <Group justify="flex-end" mt="md">
            <Button variant="light" onClick={onClose}>Cancel</Button>
            <Button type="submit">Save</Button>
          </Group>
        </Stack>
      </form>
    </Modal>
  );
} 