import { useState, useEffect } from 'react';
import { Stack, Title, Container, Group, Select, MultiSelect, Button, Switch, Text } from '@mantine/core';
import { useAuth } from '../../features/auth/AuthContext';
import { RequirementsList } from './RequirementsList';
import { LicenseType } from '../../api/requirements';
import { US_STATES } from '../../constants/states';
import { notifications } from '@mantine/notifications';
import { IconCheck } from '@tabler/icons-react';
import { api } from '../../api';

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
  const { user } = useAuth();
  const [selectedStates, setSelectedStates] = useState<string[]>(user?.states || []);
  const [selectedLicenseType, setSelectedLicenseType] = useState<LicenseType | null>(
    user?.licenseType || null
  );
  const [sortBy, setSortBy] = useState<SortOption>('state');
  const [groupByLicense, setGroupByLicense] = useState(false);

  useEffect(() => {
    if (user) {
      setSelectedStates(user.states);
      setSelectedLicenseType(user.licenseType || null);
    }
  }, [user]);

  const handleSaveStates = async () => {
    try {
      await api.patch('/users/profile', {
        states: selectedStates,
        licenseType: selectedLicenseType,
      });
      
      notifications.show({
        title: 'States Updated',
        message: 'Your states and license type have been saved',
        icon: <IconCheck size="1.1rem" />,
        color: 'green',
      });
    } catch (error) {
      notifications.show({
        title: 'Error',
        message: 'Failed to update states',
        color: 'red',
      });
    }
  };

  return (
    <Container size="xl">
      <Stack spacing="md">
        <Title order={1}>CME Requirements by State</Title>
        
        <Group align="flex-end">
          <MultiSelect
            label="Select States"
            placeholder="Choose states"
            data={US_STATES}
            value={selectedStates}
            onChange={setSelectedStates}
            searchable
            clearable
            style={{ minWidth: 300 }}
          />
          
          <Select
            label="License Type"
            placeholder="Choose license type"
            data={LICENSE_TYPES}
            value={selectedLicenseType}
            onChange={(value) => setSelectedLicenseType(value as LicenseType)}
            clearable
            style={{ minWidth: 150 }}
          />

          <Group spacing="xs">
            {user && (
              <Button 
                variant="light" 
                onClick={() => {
                  setSelectedStates(user.states);
                  setSelectedLicenseType(user.licenseType || null);
                }}
              >
                Reset to My States
              </Button>
            )}
            
            {user && (
              <Button 
                onClick={handleSaveStates}
                disabled={
                  selectedStates.length === 0 ||
                  (JSON.stringify(selectedStates) === JSON.stringify(user.states) &&
                    selectedLicenseType === user.licenseType)
                }
              >
                Save as My States
              </Button>
            )}
          </Group>
        </Group>

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