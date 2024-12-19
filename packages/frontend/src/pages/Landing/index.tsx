import {
  Container,
  Title,
  Text,
  Button,
  Group,
  List,
  ThemeIcon,
  rem,
  Stack,
  Grid,
  Card,
  Image,
  AppShell,
} from '@mantine/core';
import { Link } from 'react-router-dom';
import {
  IconCheck,
  IconCertificate,
  IconClock,
  IconDeviceMobile,
} from '@tabler/icons-react';
import { Helmet } from 'react-helmet-async';
import { LandingHeader } from './Header';
import { LandingFooter } from './Footer';

const features = [
  {
    icon: IconCertificate,
    title: 'Easy Credit Tracking',
    description: 'Automatically track and categorize your CME credits',
  },
  {
    icon: IconClock,
    title: 'Deadline Management',
    description: 'Never miss a certification deadline again',
  },
  {
    icon: IconDeviceMobile,
    title: 'Mobile-Friendly',
    description: 'Upload certificates and check status on the go',
  },
];

export function LandingPage() {
  return (
    <AppShell
      header={{ height: 60 }}
      padding={0}
    >
      <LandingHeader />
      <AppShell.Main>
        <Helmet>
          <title>CME Tracker - Simplify Your Continuing Medical Education</title>
          <meta
            name="description"
            content="Effortlessly track and manage your CME credits. Smart document processing, deadline reminders, and mobile-friendly interface for busy medical professionals."
          />
          <meta
            name="keywords"
            content="CME tracking, medical education, CME credits, physician CME, medical certification"
          />
        </Helmet>

        <Container size="xl" py="xl">
          {/* Hero Section */}
          <Grid align="center" gutter={50}>
            <Grid.Col span={{ base: 12, md: 6 }}>
              <Stack gap="xl">
                <Title order={1} size="h1">
                  Simplify Your CME Management
                </Title>
                <Text size="lg" c="dimmed">
                  Stop struggling with spreadsheets and paper certificates. 
                  Track your CME credits effortlessly with smart document processing 
                  and automatic categorization.
                </Text>
                <Group>
                  <Button
                    component={Link}
                    to="/signup"
                    size="lg"
                    variant="gradient"
                  >
                    Get Started
                  </Button>
                  <Button
                    component="a"
                    href="#features"
                    size="lg"
                    variant="light"
                  >
                    Learn More
                  </Button>
                </Group>
              </Stack>
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 6 }}>
              <Image
                src="/hero-image.svg" // We'll need to add this
                alt="CME Tracker Dashboard Preview"
              />
            </Grid.Col>
          </Grid>

          {/* Features Section */}
          <Stack mt={100} id="features">
            <Title order={2} ta="center">
              Everything You Need to Manage Your CME
            </Title>
            <Text c="dimmed" ta="center" maw={600} mx="auto">
              Built specifically for medical professionals, our platform helps you
              stay on top of your continuing education requirements.
            </Text>

            <Grid mt={30}>
              {features.map((feature) => (
                <Grid.Col key={feature.title} span={{ base: 12, md: 4 }}>
                  <Card withBorder padding="xl">
                    <ThemeIcon
                      size={50}
                      radius="md"
                      variant="gradient"
                      mb="md"
                    >
                      <feature.icon size={rem(26)} stroke={1.5} />
                    </ThemeIcon>
                    <Text fz="lg" fw={500} mb="sm">
                      {feature.title}
                    </Text>
                    <Text c="dimmed">
                      {feature.description}
                    </Text>
                  </Card>
                </Grid.Col>
              ))}
            </Grid>
          </Stack>

          {/* Benefits Section */}
          <Stack mt={100}>
            <Title order={2} ta="center">
              Why Choose CME Tracker?
            </Title>
            <Grid align="center" gutter={50}>
              <Grid.Col span={{ base: 12, md: 6 }}>
                <List
                  spacing="lg"
                  size="lg"
                  icon={
                    <ThemeIcon size={32} radius="xl" color="teal">
                      <IconCheck size={rem(20)} stroke={1.5} />
                    </ThemeIcon>
                  }
                >
                  <List.Item>
                    <b>Smart Document Processing</b> – Upload certificates and let our
                    system extract the important details
                  </List.Item>
                  <List.Item>
                    <b>Automatic Categorization</b> – Credits are automatically
                    categorized based on activity type
                  </List.Item>
                  <List.Item>
                    <b>Deadline Tracking</b> – Get notified before your credits
                    expire or deadlines approach
                  </List.Item>
                  <List.Item>
                    <b>Mobile Friendly</b> – Access your records and upload new
                    certificates from anywhere
                  </List.Item>
                </List>
              </Grid.Col>
              <Grid.Col span={{ base: 12, md: 6 }}>
                <Image
                  src="/features-image.svg" // We'll need to add this
                  alt="CME Tracker Features"
                />
              </Grid.Col>
            </Grid>
          </Stack>

          {/* CTA Section */}
          <Stack mt={100} mb={50} ta="center">
            <Title order={2}>Ready to Simplify Your CME Management?</Title>
            <Text c="dimmed" maw={600} mx="auto">
              Join thousands of medical professionals who have already simplified
              their CME tracking process.
            </Text>
            <Group justify="center" mt="xl">
              <Button
                component={Link}
                to="/signup"
                size="lg"
                variant="gradient"
              >
                Get Started Now
              </Button>
              <Button
                component={Link}
                to="/login"
                size="lg"
                variant="light"
              >
                Sign In
              </Button>
            </Group>
          </Stack>
        </Container>
      </AppShell.Main>
      <LandingFooter />
    </AppShell>
  );
} 