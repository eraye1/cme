import { useForm } from '@mantine/form';
import {
  TextInput,
  PasswordInput,
  Button,
  Paper,
  Title,
  Text,
  Stack,
  Container,
  Divider,
  Select,
  MultiSelect,
} from '@mantine/core';
import { Link, useNavigate } from 'react-router-dom';
import { notifications } from '@mantine/notifications';
import { useAuth } from '../../features/auth/AuthContext';
import { US_STATES } from '../../constants/states';
import { MEDICAL_SPECIALTIES } from '../../constants/specialties';
import { LicenseType } from '../../api/requirements';
import { LICENSE_TYPES } from '../../constants/licenses';
import { storage } from '../../utils/storage';
import { SignUpResponse } from '../../types/auth';

interface SignupForm {
  email: string;
  password: string;
  name: string;
  licenseNumber?: string;
  specialty?: string;
  licenseType?: LicenseType;
  states: string[];
}

export function Signup() {
  const { signup } = useAuth();
  const navigate = useNavigate();

  const form = useForm<SignupForm>({
    initialValues: {
      email: '',
      password: '',
      name: '',
      licenseNumber: '',
      specialty: '',
      licenseType: undefined,
      states: [],
    },
    validate: {
      email: (value) => (/^\S+@\S+$/.test(value) ? null : 'Invalid email'),
      password: (value) => (value.length < 6 ? 'Password must be at least 6 characters' : null),
      name: (value) => (!value ? 'Name is required' : null),
      states: (value) => (value.length === 0 ? 'Please select at least one state' : null),
    },
  });

  const handleSubmit = async (values: SignupForm) => {
    try {
      const data: SignUpResponse = await signup(values);
      notifications.show({
        title: 'Welcome!',
        message: 'Your account has been created successfully',
        color: 'green',
      });
      storage.setTokens(data.accessToken, data.refreshToken);
      navigate('/app');
    } catch (error) {
      if (error.response?.status === 409) {
        form.setFieldError('email', 'An account with this email already exists');
        setTimeout(() => {
          document.querySelector<HTMLInputElement>('input[name="email"]')?.focus();
        }, 100);
      } else {
        notifications.show({
          title: 'Error',
          message: error instanceof Error ? error.message : 'Signup failed',
          color: 'red',
        });
      }
    }
  };

  return (
    <Container size={420} my={40}>
      <Title ta="center">
        Create your account
      </Title>
      <Text c="dimmed" size="sm" ta="center" mt={5}>
        Already have an account?{' '}
        <Text component={Link} to="/login" size="sm" c="blue">
          Sign in
        </Text>
      </Text>

      <Paper withBorder shadow="md" p={30} mt={30} radius="md">
        <form onSubmit={form.onSubmit(handleSubmit)}>
          <Stack>
            <TextInput
              label="Name"
              placeholder="Your name"
              required
              {...form.getInputProps('name')}
            />
            
            <TextInput
              label="Email"
              placeholder="you@example.com"
              required
              {...form.getInputProps('email')}
            />

            <PasswordInput
              label="Password"
              placeholder="Your password"
              required
              {...form.getInputProps('password')}
            />

            <Divider label="Professional Information" labelPosition="center" />

            <Select
              label="License Type"
              placeholder="Select your license type"
              data={LICENSE_TYPES}
              {...form.getInputProps('licenseType')}
            />

            <TextInput
              label="License Number"
              placeholder="Your medical license number"
              {...form.getInputProps('licenseNumber')}
            />

            <Select
              label="Specialty"
              placeholder="Select your specialty"
              data={MEDICAL_SPECIALTIES}
              searchable
              clearable
              {...form.getInputProps('specialty')}
            />

            <MultiSelect
              required
              label="States"
              description="Select states where you practice or plan to practice"
              placeholder="Select states"
              data={US_STATES}
              searchable
              {...form.getInputProps('states')}
            />

            <Button type="submit" fullWidth mt="xl">
              Sign up
            </Button>
          </Stack>
        </form>
      </Paper>
    </Container>
  );
} 