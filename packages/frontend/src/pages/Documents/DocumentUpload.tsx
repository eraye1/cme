import { Group, Text, useMantineTheme, rem } from '@mantine/core';
import { Dropzone, FileWithPath } from '@mantine/dropzone';
import { IconUpload, IconX, IconFile } from '@tabler/icons-react';
import { notifications } from '@mantine/notifications';
import { useAuth } from '../../features/auth/AuthContext';
import { documentsApi } from '../../api/documents';
import { useState } from 'react';

interface DocumentUploadProps {
  onSuccess?: () => void;
}

export function DocumentUpload({ onSuccess }: DocumentUploadProps) {
  const theme = useMantineTheme();
  const { state: { user } } = useAuth();
  const [isUploading, setIsUploading] = useState(false);

  const handleDrop = async (files: FileWithPath[]) => {
    if (!user || isUploading) return;

    try {
      setIsUploading(true);
      const file = files[0];
      const formData = new FormData();
      formData.append('file', file);

      await documentsApi.upload(user.id, formData);
      
      notifications.show({
        title: 'Success',
        message: 'Document uploaded successfully',
        color: 'green',
      });

      onSuccess?.();
    } catch (error) {
      notifications.show({
        title: 'Error',
        message: error instanceof Error ? error.message : 'Upload failed',
        color: 'red',
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Dropzone
      onDrop={handleDrop}
      maxSize={5 * 1024 ** 2}
      accept={['application/pdf', 'image/jpeg', 'image/png']}
      loading={isUploading}
    >
      <Group justify="center" gap="xl" mih={220} style={{ pointerEvents: 'none' }}>
        <Dropzone.Accept>
          <IconUpload
            style={{ width: rem(52), height: rem(52), color: theme.colors.blue[6] }}
            stroke={1.5}
          />
        </Dropzone.Accept>
        <Dropzone.Reject>
          <IconX
            style={{ width: rem(52), height: rem(52), color: theme.colors.red[6] }}
            stroke={1.5}
          />
        </Dropzone.Reject>
        <Dropzone.Idle>
          <IconFile
            style={{ width: rem(52), height: rem(52), color: theme.colors.gray[6] }}
            stroke={1.5}
          />
        </Dropzone.Idle>

        <div>
          <Text size="xl" inline>
            {isUploading ? 'Uploading...' : 'Drag CME documents here or click to select'}
          </Text>
          <Text size="sm" c="dimmed" inline mt={7}>
            Upload your CME certificates, transcripts, or other documentation (PDF, JPG, PNG)
          </Text>
        </div>
      </Group>
    </Dropzone>
  );
} 