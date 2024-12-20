import { MantineProvider, MantineThemeOverride } from '@mantine/core';
import { Notifications } from '@mantine/notifications';
import { AuthProvider } from '../features/auth/AuthProvider';

const theme: MantineThemeOverride = {
  // ... your theme configuration
};

export function AppProvider({ children }: { children: React.ReactNode }) {
  return (
    <MantineProvider theme={theme} withNormalizeCSS withGlobalStyles>
      <Notifications position="top-center" limit={3} />
      <AuthProvider>
        {children}
      </AuthProvider>
    </MantineProvider>
  );
} 