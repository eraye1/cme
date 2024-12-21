import { useState, useEffect } from 'react';
import { Stack, Title, Container, Group, Select, MultiSelect, Button, Switch, Text, Loader, Badge } from '@mantine/core';
import { useAuth } from '../../features/auth/AuthContext';
import { RequirementsList } from './RequirementsList';
import { LicenseType } from '../../api/requirements';
import { US_STATES } from '../../constants/states';
import { notifications } from '@mantine/notifications';
import { IconCheck, IconFilter, IconFilterOff } from '@tabler/icons-react';
import { api } from '../../api';
import { STATE_SUPPORT_STATUS, isStateSupported } from '../../utils/formatters';

const LICENSE_TYPES = [
  { value: 'MD', label: 'MD' },
  { value: 'DO', label: 'DO' },
  { value: 'MD_DO', label: 'MD/DO' },
];

type SortOption = 'state' | 'hours' | 'cycle';

function RequirementsSummary({ requirements }: { requirements: JurisdictionRequirement[] }) {
  const totalHours = requirements.reduce((sum, req) => sum + req.totalHours, 0);
  const avgCycleLength = Math.round(
    requirements.reduce((sum, req) => sum + req.cycleLength, 0) / requirements.length
  );

  return (
    <Group spacing="xl">
      <Stack spacing={0}>
        <Text size="sm" color="dimmed">Total States</Text>
        <Text size="xl" weight={700}>{requirements.length}</Text>
      </Stack>
      
      <Stack spacing={0}>
        <Text size="sm" color="dimmed">Total Required Hours</Text>
        <Text size="xl" weight={700}>{totalHours}</Text>
      </Stack>
      
      <Stack spacing={0}>
        <Text size="sm" color="dimmed">Average Cycle Length</Text>
        <Text size="xl" weight={700}>{avgCycleLength} months</Text>
      </Stack>
    </Group>
  );
}

export function Requirements() {
  const { state: { user, isLoading } } = useAuth();

  const [isFilteringByProfile, setIsFilteringByProfile] = useState(true);
  const [selectedStates, setSelectedStates] = useState<string[]>([]);
  const [selectedLicenseType, setSelectedLicenseType] = useState<LicenseType | null>(null);
  const [sortBy, setSortBy] = useState<SortOption>('state');
  const [groupByLicense, setGroupByLicense] = useState(false);

  // Update filters when user is loaded
  useEffect(() => {
    if (!isLoading && user && isFilteringByProfile) {
      setSelectedStates(user.states);
      setSelectedLicenseType(user.licenseType || null);
    }
  }, [user, isLoading, isFilteringByProfile]);

  const handleToggleFilter = () => {
    setIsFilteringByProfile(!isFilteringByProfile);
    if (isFilteringByProfile) {
      // Switching to manual filter - keep current selection
      // This allows users to start from their states and modify from there
    } else {
      // Switching back to profile filter
      setSelectedStates(user?.states || []);
      setSelectedLicenseType(user?.licenseType || null);
    }
  };

  const handleSaveToProfile = async () => {
    try {
      await api.patch('/auth/profile', {
        states: selectedStates,
        licenseType: selectedLicenseType,
      });
      
      notifications.show({
        title: 'Profile Updated',
        message: 'Your states and license type have been saved to your profile',
        icon: <IconCheck size="1.1rem" />,
        color: 'green',
      });
      
      // Switch back to profile filtering
      setIsFilteringByProfile(true);
    } catch (error) {
      notifications.show({
        title: 'Error',
        message: 'Failed to update profile',
        color: 'red',
      });
    }
  };

  if (isLoading) {
    return (
      <Container size="xl">
        <Stack spacing="md">
          <Title order={1}>CME Requirements</Title>
          <Loader />
        </Stack>
      </Container>
    );
  }

  return (
    <Container size="xl">
      <Stack spacing="md">
        <Group position="apart">
          <Title order={1}>CME Requirements</Title>
          <Group spacing="xs">
            <Button
              variant="subtle"
              onClick={handleToggleFilter}
            >
              {isFilteringByProfile ? 'Customize Filter' : 'Use Profile Filter'}
            </Button>
          </Group>
        </Group>

        {!isFilteringByProfile && (
          <Group align="flex-end">
            <MultiSelect
              label="States"
              placeholder="Select states"
              data={US_STATES.map(state => ({
                value: state.value,
                label: state.label + (isStateSupported(state.value) ? '' : ' (Coming Soon)'),
                disabled: !isStateSupported(state.value), // Optional: prevent selection of unsupported states
              }))}
              value={selectedStates}
              onChange={setSelectedStates}
              searchable
              clearable
              style={{ minWidth: 300 }}
              rightSection={selectedStates.some(s => !isStateSupported(s)) && (
                <Badge color="yellow" size="sm">
                  Some states not yet supported
                </Badge>
              )}
            />

            <Select
              label="License Type"
              placeholder="Select license type"
              data={LICENSE_TYPES}
              value={selectedLicenseType}
              onChange={(value) => setSelectedLicenseType(value as LicenseType)}
              clearable
              style={{ minWidth: 150 }}
            />

            {user && (
              <Button
                onClick={handleSaveToProfile}
                disabled={
                  selectedStates.length === 0 ||
                  (JSON.stringify(selectedStates) === JSON.stringify(user.states) &&
                    selectedLicenseType === user.licenseType)
                }
              >
                Save to Profile
              </Button>
            )}
          </Group>
        )}

        <Group position="apart">
          <Group>
            <Select
              label="Sort by"
              data={[
                { value: 'state', label: 'State' },
                { value: 'hours', label: 'Required Hours' },
                { value: 'cycle', label: 'Cycle Length' },
              ]}
              value={sortBy}
              onChange={(value) => setSortBy(value as SortOption)}
              style={{ width: 200 }}
            />
            
            <Switch
              label="Group by License Type"
              checked={groupByLicense}
              onChange={(event) => setGroupByLicense(event.currentTarget.checked)}
            />
          </Group>
        </Group>

        <RequirementsList 
          selectedStates={selectedStates}
          selectedLicenseType={selectedLicenseType}
          sortBy={sortBy}
          groupByLicense={groupByLicense}
        />
      </Stack>
    </Container>
  );
}

export default Requirements; 