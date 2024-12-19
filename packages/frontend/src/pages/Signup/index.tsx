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
} from '@mantine/core';
import { Link, useNavigate } from 'react-router-dom';
import { notifications } from '@mantine/notifications';
import { useAuth } from '../../features/auth/AuthContext';

interface SignupForm {
  email: string;
  password: string;
  name: string;
  licenseNumber?: string;
  specialty?: string;
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
    },
    validate: {
      email: (value) => (/^\S+@\S+$/.test(value) ? null : 'Invalid email'),
      password: (value) => (value.length < 6 ? 'Password must be at least 6 characters' : null),
      name: (value) => (!value ? 'Name is required' : null),
    },
  });

  const handleSubmit = async (values: SignupForm) => {
    try {
      await signup(values);
      notifications.show({
        title: 'Welcome!',
        message: 'Your account has been created successfully',
        color: 'green',
      });
      navigate('/app');
    } catch (error) {
      notifications.show({
        title: 'Error',
        message: error instanceof Error ? error.message : 'Signup failed',
        color: 'red',
      });
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

            <Divider label="Optional Information" labelPosition="center" />

            <TextInput
              label="License Number"
              placeholder="Your medical license number"
              {...form.getInputProps('licenseNumber')}
            />

            <TextInput
              label="Specialty"
              placeholder="Your medical specialty"
              {...form.getInputProps('specialty')}
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