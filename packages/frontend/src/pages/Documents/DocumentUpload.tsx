import { Group, Text, useMantineTheme, rem } from '@mantine/core';
import { Dropzone, FileWithPath } from '@mantine/dropzone';
import { IconUpload, IconX, IconFile } from '@tabler/icons-react';
import { notifications } from '@mantine/notifications';
import { useAuth } from '../../features/auth/AuthContext';
import { documentsApi } from '../../api/documents';
import { useState } from 'react';
import { Document } from '../../types';

interface DocumentUploadProps {
  onSuccess: (document: Document) => void;
}

export function DocumentUpload({ onSuccess }: DocumentUploadProps) {
  const theme = useMantineTheme();
  const { state: { user } } = useAuth();
  const [uploading, setUploading] = useState(false);

  const handleDrop = async (files: FileWithPath[]) => {
    if (!user || uploading || !files.length) return;

    const file = files[0];
    try {
      setUploading(true);
      const formData = new FormData();
      formData.append('file', file);

      const document = await documentsApi.upload(user.id, formData);
      notifications.show({
        title: 'Success',
        message: 'Document uploaded successfully',
        color: 'green',
      });
      onSuccess(document);
    } catch (error) {
      notifications.show({
        title: 'Error',
        message: error instanceof Error ? error.message : 'Failed to upload document',
        color: 'red',
      });
    } finally {
      setUploading(false);
    }
  };

  return (
    <Dropzone
      onDrop={handleDrop}
      maxSize={5 * 1024 ** 2}
      accept={['application/pdf', 'image/jpeg', 'image/png']}
      loading={uploading}
      multiple={false}
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
            {uploading ? 'Uploading...' : 'Drag CME documents here or click to select'}
          </Text>
          <Text size="sm" c="dimmed" inline mt={7}>
            Upload your CME certificates, transcripts, or other documentation (PDF, JPG, PNG)
          </Text>
        </div>
      </Group>
    </Dropzone>
  );
} 