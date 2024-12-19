import { Stack, Title, Group, Button, Modal } from '@mantine/core';
import { IconUpload } from '@tabler/icons-react';
import { useState, useEffect } from 'react';
import { DocumentUpload } from './DocumentUpload';
import { DocumentsList } from './DocumentsList';
import { useQueryClient } from '@tanstack/react-query';
import { useAuth } from '../../features/auth/AuthContext';

export function Documents() {
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const queryClient = useQueryClient();
  const { state: { user } } = useAuth();

  useEffect(() => {
    console.log('Documents page mounted, user:', !!user);
  }, [user]);

  const handleUploadSuccess = () => {
    setUploadModalOpen(false);
    // Refresh the documents list
    if (user) {
      queryClient.invalidateQueries({ queryKey: ['documents', user.id] });
    }
  };

  return (
    <Stack spacing="lg">
      <Group justify="space-between" align="center">
        <Title order={1}>Documents</Title>
        <Button 
          leftSection={<IconUpload size="1rem" />}
          onClick={() => setUploadModalOpen(true)}
        >
          Upload Document
        </Button>
      </Group>

      <DocumentsList />

      <Modal
        opened={uploadModalOpen}
        onClose={() => setUploadModalOpen(false)}
        title="Upload CME Document"
        size="lg"
      >
        <DocumentUpload onSuccess={handleUploadSuccess} />
      </Modal>
    </Stack>
  );
}

export default Documents; 