import { AppShell, Burger, Group, Title, Button, Menu } from '@mantine/core';
import { MainNav } from './MainNav';
import { Outlet, useNavigate } from 'react-router-dom';
import { useDisclosure } from '@mantine/hooks';
import { IconUser, IconLogout, IconSettings } from '@tabler/icons-react';
import { useAuth } from '../features/auth/AuthContext';
import { notifications } from '@mantine/notifications';

export function Layout() {
  const [opened, { toggle, close }] = useDisclosure();
  const { state: { user }, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      notifications.show({
        title: 'Goodbye!',
        message: 'You have been logged out successfully',
        color: 'blue',
      });
    } catch (error) {
      console.error('Logout error:', error);
      notifications.show({
        title: 'Error',
        message: 'Failed to logout properly, but you have been signed out.',
        color: 'yellow',
      });
    }
  };

  return (
    <AppShell
      header={{ height: 60 }}
      navbar={{
        width: 300,
        breakpoint: 'sm',
        collapsed: { mobile: !opened },
      }}
      padding="md"
    >
      <AppShell.Header>
        <Group h="100%" px="md" justify="space-between">
          <Group>
            <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />
            <Title order={3}>CME Tracker</Title>
          </Group>

          <Menu position="bottom-end" shadow="md">
            <Menu.Target>
              <Button variant="subtle" leftSection={<IconUser size="1rem" />}>
                {user?.name}
              </Button>
            </Menu.Target>

            <Menu.Dropdown>
              <Menu.Label>Account</Menu.Label>
              <Menu.Item
                leftSection={<IconSettings size="0.9rem" />}
                onClick={() => navigate('/app/settings')}
              >
                Settings
              </Menu.Item>
              <Menu.Divider />
              <Menu.Item
                color="red"
                leftSection={<IconLogout size="0.9rem" />}
                onClick={handleLogout}
              >
                Logout
              </Menu.Item>
            </Menu.Dropdown>
          </Menu>
        </Group>
      </AppShell.Header>

      <AppShell.Navbar p="md">
        <MainNav onNavigate={close} />
      </AppShell.Navbar>

      <AppShell.Main>
        <Outlet />
      </AppShell.Main>
    </AppShell>
  );
} 