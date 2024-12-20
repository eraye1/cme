import { useState } from 'react';
import { 
  Stack, 
  MultiSelect, 
  Select, 
  Button, 
  Group,
  TextInput,
} from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { IconCheck } from '@tabler/icons-react';
import { api } from '../../api';
import { useAuth } from '../../features/auth/AuthContext';
import { US_STATES } from '../../constants/states';
import { LicenseType } from '../../api/requirements';
import { MEDICAL_SPECIALTIES } from '../../constants/specialties';
import { LICENSE_TYPES } from '../../constants/licenses';

export function ProfileEditor() {
  const { user, updateUser } = useAuth();
  const [states, setStates] = useState<string[]>(user?.states || []);
  const [licenseType, setLicenseType] = useState<LicenseType | null>(user?.licenseType || null);
  const [licenseNumber, setLicenseNumber] = useState(user?.licenseNumber || '');
  const [specialty, setSpecialty] = useState(user?.specialty || '');

  const handleSave = async () => {
    try {
      const { data } = await api.patch('/users/profile', {
        states,
        licenseType,
        licenseNumber,
        specialty,
      });
      
      updateUser(data);
      
      notifications.show({
        title: 'Profile Updated',
        message: 'Your profile has been updated successfully',
        icon: <IconCheck size="1.1rem" />,
        color: 'green',
      });
    } catch (error) {
      notifications.show({
        title: 'Error',
        message: 'Failed to update profile',
        color: 'red',
      });
    }
  };

  return (
    <Stack spacing="md">
      <Select
        label="License Type"
        placeholder="Select your license type"
        value={licenseType}
        onChange={(value) => setLicenseType(value as LicenseType)}
        data={LICENSE_TYPES}
      />

      <TextInput
        label="License Number"
        placeholder="Optional"
        value={licenseNumber}
        onChange={(e) => setLicenseNumber(e.currentTarget.value)}
      />

      <Select
        label="Specialty"
        placeholder="Select your specialty"
        data={MEDICAL_SPECIALTIES}
        value={specialty}
        onChange={setSpecialty}
        searchable
        clearable
      />

      <MultiSelect
        label="States"
        description="Select states where you practice"
        placeholder="Select states"
        data={US_STATES}
        value={states}
        onChange={setStates}
        searchable
        nothingFound="No states found"
      />

      <Group position="right">
        <Button 
          onClick={handleSave}
          disabled={
            JSON.stringify(states) === JSON.stringify(user?.states) &&
            licenseType === user?.licenseType &&
            licenseNumber === user?.licenseNumber &&
            specialty === user?.specialty
          }
        >
          Save Changes
        </Button>
      </Group>
    </Stack>
  );
} 