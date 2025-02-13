import { Modal, TextInput, NumberInput, Select, Button, Stack, Group, Textarea, ScrollArea, Box, MultiSelect, TagsInput } from '@mantine/core';
import { DateInput } from '@mantine/dates';
import { useForm } from '@mantine/form';
import { ActivityType, CreditCategory, SpecialTopicType } from '../../types';

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
  description: string;
  specialRequirements: SpecialTopicType[];
  topics: string[];
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
      description: initialData?.description || '',
      specialRequirements: initialData?.specialRequirements || [],
      topics: initialData?.topics || [],
      notes: initialData?.notes || '',
    },
  });

  const handleSubmit = async (values: DocumentFormValues) => {
    try {
      await onSave(values);
      onClose();
    } catch (error) {
    }
  };

  return (
    <Modal 
      opened={opened} 
      onClose={onClose}
      title="Edit Document Details"
      size="lg"
      styles={{
        inner: {
          padding: '20px',
        },
        content: {
          maxHeight: 'calc(100vh - 40px)',
        },
        body: {
          padding: 0,
          overflow: 'hidden',
        },
        header: {
          marginBottom: 0,
          padding: '20px',
        },
      }}
    >
      <Box style={{ display: 'flex', flexDirection: 'column', height: 'calc(90vh - 120px)' }}>
        <ScrollArea style={{ flex: 1 }} type="auto" offsetScrollbars>
          <Box p="md">
            <form onSubmit={form.onSubmit(handleSubmit)}>
              <Stack gap="md">
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

                <Textarea
                  label="Description"
                  placeholder="Activity description"
                  minRows={3}
                  autosize
                  maxRows={6}
                  {...form.getInputProps('description')}
                />

                <MultiSelect
                  label="Special Requirements"
                  placeholder="Select requirements this activity fulfills"
                  data={Object.values(SpecialTopicType).map(value => ({
                    value,
                    label: value.replace(/_/g, ' ').toLowerCase()
                      .replace(/\b\w/g, l => l.toUpperCase())
                  }))}
                  {...form.getInputProps('specialRequirements')}
                />

                <TagsInput
                  label="Topics"
                  placeholder="Enter topics and press Enter"
                  {...form.getInputProps('topics')}
                />

                <Textarea
                  label="Notes"
                  placeholder="Additional notes"
                  minRows={2}
                  autosize
                  maxRows={4}
                  {...form.getInputProps('notes')}
                />
              </Stack>
            </form>
          </Box>
        </ScrollArea>

        <Box 
          p="md" 
          style={{ 
            borderTop: '1px solid var(--mantine-color-gray-3)',
            backgroundColor: 'var(--mantine-color-body)',
          }}
        >
          <Group justify="flex-end">
            <Button variant="light" onClick={onClose}>Cancel</Button>
            <Button onClick={form.onSubmit(handleSubmit)}>Save</Button>
          </Group>
        </Box>
      </Box>
    </Modal>
  );
} 