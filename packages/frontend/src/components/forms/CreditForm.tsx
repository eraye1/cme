import { useForm } from '@mantine/form';
import { TextInput, NumberInput, Select, Button, Stack } from '@mantine/core';
import { DateInput } from '@mantine/dates';
import { ActivityType, CreditCategory } from '@prisma/client';

interface CreditFormValues {
  title: string;
  provider: string;
  credits: number;
  category: CreditCategory;
  activityType: ActivityType;
  completedAt: Date;
  description?: string;
  location?: string;
}

export function CreditForm() {
  const form = useForm<CreditFormValues>({
    initialValues: {
      title: '',
      provider: '',
      credits: 0,
      category: CreditCategory.AMA_PRA_CATEGORY_1,
      activityType: ActivityType.ONLINE_COURSE,
      completedAt: new Date(),
      description: '',
      location: '',
    },
    validate: {
      title: (value) => !value && 'Title is required',
      provider: (value) => !value && 'Provider is required',
      credits: (value) => value <= 0 && 'Credits must be greater than 0',
    },
  });

  return (
    <form onSubmit={form.onSubmit((values) => console.log(values))}>
      <Stack>
        <TextInput
          label="Title"
          placeholder="Activity title"
          required
          {...form.getInputProps('title')}
        />
        
        <TextInput
          label="Provider"
          placeholder="Provider name"
          required
          {...form.getInputProps('provider')}
        />

        <NumberInput
          label="Credits"
          placeholder="Number of credits"
          required
          min={0}
          {...form.getInputProps('credits')}
        />

        <Select
          label="Category"
          data={Object.values(CreditCategory)}
          {...form.getInputProps('category')}
        />

        <Select
          label="Activity Type"
          data={Object.values(ActivityType)}
          {...form.getInputProps('activityType')}
        />

        <DateInput
          label="Completion Date"
          placeholder="When did you complete this activity?"
          {...form.getInputProps('completedAt')}
        />

        <TextInput
          label="Description"
          placeholder="Optional description"
          {...form.getInputProps('description')}
        />

        <TextInput
          label="Location"
          placeholder="Optional location"
          {...form.getInputProps('location')}
        />

        <Button type="submit">Save</Button>
      </Stack>
    </form>
  );
} 